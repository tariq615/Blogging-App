import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";

function Home() {
  const posts = useLoaderData()


  useEffect(() => {
    const hasLoggedIn = sessionStorage.getItem("hasLoggedIn");
    if (hasLoggedIn === "true") {
      sessionStorage.removeItem("hasLoggedIn"); // Clear the flag
      window.location.reload(); // Reload only once after login
    }
  }, []);

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  
  // When user logs in:
  useEffect(() => {
    if (userData && userData.$id) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);  // Run this whenever userData changes
  

  

/* const [posts, setPosts] = useState([]);    withoutloader
  useEffect(() => {
    if (authStatus) {
      appwriteService.getPosts().then((posts) => {
        if (posts) {
          setPosts(posts.documents);
        }
      });
    }
  }, []); */

  if (authStatus && posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts yet
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  } else if (authStatus) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </Container>
      </div>
    );
  } else{
    return (
        <div className="w-full py-8 mt-4 text-center">
          <Container>
            <div className="flex flex-wrap">
              <div className="p-2 w-full">
                <h1 className="text-2xl font-bold hover:text-gray-500">
                  Login to post
                </h1>
              </div>
            </div>
          </Container>
        </div>
      );
  }
}

export default Home;


export const postsLoaderData = async () => {
  return appwriteService
    .getPosts()
    .then((posts) => posts.documents || [])
    .catch((error) => {
      console.error('Error fetching posts:', error);
    });
};
