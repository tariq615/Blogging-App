
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { removePost } from "../store/postSlice";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.userData);
    console.log(userData);
    
    const isAuthor = post && userData ? post.userid === userData.$id : false;
    console.log(isAuthor);
    

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                // Delete the associated file from Appwrite if the post is successfully deleted
                appwriteService.deleteFile(post.featuredimage);

                // Dispatch an action to remove the post from the Redux store
                dispatch(removePost(post.$id));

                // Update sessionStorage by removing the deleted post
                const storedPosts = sessionStorage.getItem('postData');
                if (storedPosts) {
                    const parsedPosts = JSON.parse(storedPosts);
                    const updatedPosts = parsedPosts.filter((p) => p.$id !== post.$id);
                    sessionStorage.setItem('postData', JSON.stringify(updatedPosts));
                }

                // Navigate back to home or desired route after deletion
                navigate("/");
            }
        })
    }

    return post ? (
        <div className=" mt-24 ">
            <div className="max-w-screen-lg  mx-auto p-5 sm:p-10 md:p-16 border">
          <div className="mb-10 rounded overflow-hidden flex flex-col mx-auto">
            <Link
              to=""
              class="max-w-3xl mx-auto text-xl sm:text-4xl font-semibold inline-block hover:text-indigo-600 transition duration-500 ease-in-out  mb-2"
            >
              {post.title}
            </Link>

            <div className="relative">
              <Link to="">
                <img
                  className="w-full rounded-lg"
                  src={appwriteService.getFilePreview(post.featuredimage)}
                  alt={post.title}
                />
              </Link>
              {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
            </div>
            <p class="text-gray-700 py-5 text-base leading-8 browser-css ">
            {parse(post.content)}
            </p>
            <hr />
          </div>
        </div> 
     </div>
    ) : null;
}


