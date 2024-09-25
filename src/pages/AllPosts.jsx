import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Outlet } from "react-router-dom"; // Import Outlet
import { useSelector } from "react-redux";
import { Query } from 'appwrite';

function AllPosts() {
  const [allPosts, setAllPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);


  useEffect(() => {
    appwriteService
      .getPosts([Query.equal("userid",userData.$id)])
      .then((posts) => {
        if (posts) {
          setAllPosts(posts.documents);
        }
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {allPosts.map((post) => (
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
