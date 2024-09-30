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
        <Container>
          <div className="flex flex-wrap gap-5 content-center justify-center py-4 ">
            {postData.map((post) => (
                <PostCard {...post} />
              ))}
              </div>
        </Container>
    );
  } else {
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
<Container>
  <div className="flex flex-wrap gap-5 content-center justify-center py-4">
    <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img class="rounded-t-lg" src="/images/self/blog.png" alt="" />
      </a>
      <div class="p-5">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
        <a
          href="#"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</Container>;
