import React, { useEffect, useState, useCallback } from "react";
import appwriteService from "../../appwrite/config";
import { useForm } from "react-hook-form";
import { SelectInput, Button, Input, RTE } from "../";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPost } from "../../store/postSlice"; // Import the action to update posts in Redux

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });
  // console.log(post);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData); // Get user data from Redux

  // Ensure that user data is available
  useEffect(() => {
    // if (userData) {
    //   console.log("UserData available: ", userData);
    // } else {
    //   console.log('No user data found.');
    // }
  }, [userData]);

  // Function to refresh posts in Redux and localStorage
  const refreshPosts = async () => {
    try {
      const posts = await appwriteService.getPosts();
      const postData = posts.documents || [];
      // Update Redux store with latest posts
      dispatch(getPost(postData));
      // Store posts in localStorage
      localStorage.setItem("postData", JSON.stringify(postData));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Submit function to create or update a post
  const submit = async (data) => {
    setError("");
    try {
      let file;
      if (data.image[0]) {
        file = await appwriteService.uploadFile(data.image[0]);
        console.log(file);
        if (post) {
          await appwriteService.deleteFile(post.featuredimage); // Delete old image if post is updated
        }
      }

      if (post) {
        // Update existing post
        const updatedPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredimage: file ? file.$id : post.featuredimage,
        });

        if (updatedPost) {
          await refreshPosts(); // Refresh posts after updating
          navigate(`/post/${updatedPost.$id}`); // Navigate to updated post
        }
      } else {
        // Create new post
        if (file) {
          const fileId = file.$id;
          data.featuredimage = fileId;
        }

        const newPost = await appwriteService.createPost({
          ...data,
          userid: userData.$id, // Assign post to the logged-in user
        });

        if (newPost) {
          await refreshPosts(); // Refresh posts after creating
          navigate(`/post/${newPost.$id}`); // Navigate to new post
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error.message);
    }
  };

  const slugTransform = useCallback((value) => {
    return (
      value
        ?.trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .slice(0, 36)
        .replace(/\s/g, "-") || ""
    );
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setValue, slugTransform]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap mt-20">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: "title is required" })}
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1 font-bold">
            {formErrors.title.message}
          </p>
        )}
        <Input
          // label="Slug :"
          placeholder="Slug"
          className="mb-4 hidden"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
          {...register("image", {
            required: !post ? "image is required" : false,
          })}
        />
        {formErrors.image && (
          <p className="text-red-500 text-sm mt-1 font-bold">
            {formErrors.image.message}
          </p>
        )}
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="raspect-auto h-32 shadow"
            />
          </div>
        )}
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
      </div>
      <div className="w-1/3 px-2">
        <SelectInput
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
      <div className="w-full">
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
    </form>
  );
}
