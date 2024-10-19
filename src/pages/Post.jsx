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
                appwriteService.deleteFile(post.featuredimage);
                dispatch(removePost(post.$id));

                // Update sessionStorage
                const storedPosts = sessionStorage.getItem('postData');
                if (storedPosts) {
                    const parsedPosts = JSON.parse(storedPosts);
                    const updatedPosts = parsedPosts.filter((p) => p.$id !== post.$id);
                    sessionStorage.setItem('postData', JSON.stringify(updatedPosts));
                }

                navigate("/");
            }
        });
    };

    return post ? (
        <div className="mt-24">
            <div className="max-w-screen-xl  mx-auto p-5 sm:p-10 md:p-16">
                <div className="mb-10 rounded overflow-hidden flex flex-col mx-auto">
                    {/* Post Title */}
                    <Link
                        to=""
                        className="max-w-3xl mx-auto text-xl sm:text-4xl font-semibold inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
                    >
                        {post.title}
                    </Link>

                    {/* Image Section */}
                    <div className="relative mb-4 ">
                        <Link to="">
                            <img
                                className="w-full lg:h-[96vh] object-contain rounded-lg"
                                src={appwriteService.getFilePreview(post.featuredimage)}
                                alt={post.title}
                            />
                        </Link>
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
                    <p className="text-gray-700 py-5 text-base leading-8">
                        {parse(post.content)}
                    </p>
                    <hr />
                </div>
            </div>
        </div>
    ) : null;
}
