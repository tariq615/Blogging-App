import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Outlet } from "react-router-dom";
import { Query } from "appwrite";

function AllPosts() {
  // State to hold user's posts
  const [myPosts, setMyPosts] = useState([]);

  // Get userData from Redux store
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Check if post data exists in localStorage
    const storedPosts = localStorage.getItem("postData");

    if (storedPosts && userData) {
      // Use cached posts and filter to show only the current user's posts
      const parsedPosts = JSON.parse(storedPosts);
      const userPosts = parsedPosts.filter(
        (post) => post.userid === userData.$id
      );
      setMyPosts(userPosts);
    } else if (userData) {
      // Fetch posts from API if no cached data exists
      appwriteService
        .getPosts([Query.equal("userid", userData.$id)])
        .then((posts) => {
          const postData = posts.documents || [];
          setMyPosts(postData); // Update state with fetched posts
          localStorage.setItem("postData", JSON.stringify(postData)); // Cache posts in localStorage
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  }, [userData]); // Ensure useEffect runs when the user's data is available

  if (authStatus && myPosts.length === 0) {
    return (
      <div className="w-full py-8 mt-24 text-center">
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
    <Container>
      <div className="flex flex-wrap gap-5 content-center justify-center py-4 mt-24">
        {myPosts.map((post) => (
          <PostCard {...post} />
        ))}
      </div>

      <Outlet />
    </Container>
  );
}
}
export default AllPosts;
