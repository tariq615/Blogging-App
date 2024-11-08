import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { removePost } from "../store/postSlice";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userid === userData.$id : false;

  useEffect(() => {
    const storedPosts = localStorage.getItem("postData");
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      const postFromLocalStorage = parsedPosts.find((p) => p.slug === slug);
      if (postFromLocalStorage) {
        setPost(postFromLocalStorage); // Use post from localStorage if available
        return;
      }
    }

    // Fallback to API call if the post is not found in localStorage
    if (slug) {
      appwriteService.getPost(slug).then((fetchedPost) => {
        if (fetchedPost) {
          setPost(fetchedPost); // Set post if fetched from API
        } else {
          navigate("/"); // Navigate to homepage if post doesn't exist
        }
      });
    } else {
      navigate("/"); // Navigate to homepage if no slug
    }
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!post) return; // Ensure there is a post to delete

    try {
      // Step 1: Delete post from backend
      const status = await appwriteService.deletePost(post.$id);

      if (status) {
        // Step 2: Delete post image from backend if necessary
        await appwriteService.deleteFile(post.featuredimage);

        // Step 3: Remove post from Redux store
        dispatch(removePost(post.$id));

        // Step 4: Update localStorage
        const storedPosts = localStorage.getItem("postData");
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          const updatedPosts = parsedPosts.filter((p) => p.$id !== post.$id);
          localStorage.setItem("postData", JSON.stringify(updatedPosts));
        }

        // Step 5: Navigate back to the main page
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return post ? (
    <div className="mt-24">
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
        <div className="mb-10 rounded overflow-hidden flex flex-col mx-auto">
          {/* Post Title */}
          <h2 className="py-4 max-w-3xl text-xl sm:text-4xl font-semibold inline-block break-words">
            {post.title}
          </h2>

          {/* Image Section */}
          <div className="relative mb-4">
            <img
              className="w-full lg:h-[96vh] object-contain rounded-lg"
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
            />
          </div>

          {/* Edit/Delete Buttons */}
          {isAuthor && (
            <div className="flex justify-end space-x-2 mt-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}

          {/* Post Content */}
          <div className="text-gray-700 py-5 text-base leading-8">
            {parse(post.content)}
          </div>

          <hr />
        </div>
      </div>
    </div>
  ) : null;
}
