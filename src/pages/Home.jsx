import React, { useEffect } from "react";
import { Container, PostCard } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../store/postSlice";

function Home() {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.post.posts);
  const authStatus = useSelector((state) => state.auth.status);

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
    // Fetch posts from sessionStorage or API if necessary
    const storedPosts = sessionStorage.getItem("postData");
    if (storedPosts) {
      dispatch(getPost(JSON.parse(storedPosts)));
    } else if (authStatus) {
      postsData().then((posts) => {
        dispatch(getPost(posts));
        sessionStorage.setItem("postData", JSON.stringify(posts));
      });
    }
  }, [dispatch, authStatus]);

  if (authStatus && postData.length === 0) {
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
            {postData.map((post) => (
                <PostCard {...post} />
              ))}
              </div>
        </Container>
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