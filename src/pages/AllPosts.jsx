import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Outlet } from "react-router-dom"; 
import { Query } from 'appwrite';

function AllPosts() {
  // State to hold user's posts
  const [myPosts, setMyPosts] = useState([]);

  // Get userData from Redux store
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Check if post data exists in sessionStorage
    const storedPosts = sessionStorage.getItem('postData');

    if (storedPosts && userData) {
      // Use cached posts and filter to show only the current user's posts
      const parsedPosts = JSON.parse(storedPosts);
      const userPosts = parsedPosts.filter(post => post.userid === userData.$id);
      setMyPosts(userPosts);
    } else if (userData) {
      // Fetch posts from API if no cached data exists
      appwriteService
        .getPosts([Query.equal("userid", userData.$id)])
        .then((posts) => {
          const postData = posts.documents || [];
          setMyPosts(postData); // Update state with fetched posts
          sessionStorage.setItem('postData', JSON.stringify(postData)); // Cache posts in sessionStorage
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [userData]); // Ensure useEffect runs when the user's data is available

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {myPosts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
        <Outlet />
      </Container>
    </div>
  );
}

export default AllPosts;
