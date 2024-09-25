import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostForm } from "../components";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        setPost(post);
      });
    } else {
      navigate(`/`);
    }
  }, [slug, navigate]);

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
