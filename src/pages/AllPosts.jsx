import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Outlet } from "react-router-dom";
import { Query } from "appwrite";

function AllPosts() {
  // State to hold user's posts
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Get userData and authStatus from Redux store
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Reset error state

      try {
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
          const posts = await appwriteService.getPosts([Query.equal("userid", userData.$id)]);
          const postData = posts.documents || [];
          setMyPosts(postData); // Update state with fetched posts
          localStorage.setItem("postData", JSON.stringify(postData)); // Cache posts in localStorage
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (authStatus) {
      fetchPosts();
    } else {
      setMyPosts([]); // Clear posts if the user is not authenticated
      setLoading(false); // Set loading to false if not authenticated
    }
  }, [userData, authStatus]); // Ensure useEffect runs when userData or authStatus changes

  if (loading) {
    return (
      <div className="w-full py-8 mt-24 text-center">
        <Container>
        <h1 className="-mt-4 text-xl font-bold text-gray-700">Loading...</h1>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 mt-24 text-center">
        <Container>
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        </Container>
      </div>
    );
  }

  if (authStatus && myPosts.length === 0) {
    return (
      <div className="w-full py-8 mt-24 text-center">
        <Container>
          <h1 className="text-2xl font-bold hover:text-gray-500">No posts yet</h1>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] px-2 mt-28">
        {myPosts.slice().reverse().map((post) => (
          <div key={post.$id}> {/* Use unique post ID for key */}
            <PostCard {...post} />
          </div>
        ))}
      </div>
      <Outlet />
    </Container>
  );
}

export default AllPosts;
