import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Outlet } from "react-router-dom"; 
import { Query } from 'appwrite';
import { useLoaderData } from "react-router-dom";

function AllPosts() {
  
  const myPosts  = useLoaderData()
  
  /*  const [allPosts, setAllPosts] = useState([]);
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
  }, []); */
  
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


export const myPostsLoaderData = async ()=>{

 const userData = JSON.parse(sessionStorage.getItem('userData'));

  return appwriteService
  .getPosts([Query.equal("userid",userData.$id)])
  .then((posts) => posts.documents || [])
  .catch((error) => {
    console.error('Error fetching posts:', error);
  });
}