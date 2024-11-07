import React, { useEffect } from "react";
import { Container, PostCard } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../store/postSlice";
import appwriteService from "../appwrite/config"

function Home() {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.post.posts);
  const authStatus = useSelector((state) => state.auth.status);

  // In case of reload
  useEffect(() => {
    const hasLoggedIn = sessionStorage.getItem("hasLoggedIn");
    if (hasLoggedIn === "true") {
      sessionStorage.removeItem("hasLoggedIn"); // Clear the flag
      window.location.reload(); // Reload only once after login
    }
  }, []);

  // postsData function now defined in the same file
  const postsData = async () => {
    try {
      const posts = await appwriteService.getPosts();
      return posts.documents || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (authStatus) {
        try {
          const posts = await postsData(); // Fetch posts from API
          if (posts.length > 0) {
            dispatch(getPost(posts)); // Update Redux store
            localStorage.setItem("postData", JSON.stringify(posts)); // Store in localStorage
          }
        } catch (error) {
          console.error("Error fetching posts in polling:", error); // Log errors
        }
      }
    };
  
    // Initial fetch
    fetchPosts();
  
    // Polling for updates every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
  
    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [dispatch, authStatus]);
  

  console.log(postData);

  const data = postData.filter((posts) => posts.status === "active");

  if (authStatus && data.length === 0) {
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] px-2 mt-28">
  {data
    .slice()
    .reverse()
    .map((post, index) => (
      <div key={index} className="">
        <PostCard {...post} />
      </div>
    ))}
</div>

    );
  } else {
    return (
      <div className="w-full py-8 mt-36 text-center">
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
