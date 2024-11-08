import React, { useState } from "react";
import { Logo, Input, Button } from "./index";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appwriteService from '../appwrite/config';
import { useForm } from "react-hook-form";
import { login as authLogin } from "../store/authSlice";
import { getPost } from "../store/postSlice";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Initially not loading

  const login = async (data) => {
    setError("");
    setLoading(true); // Set loading to true when login starts
    try {
      const local = await authService.login(data);
      
      if (local) {
        const userData = await authService.getCurrentUser();

        // Fetch posts and store them in localStorage
        const postData = await appwriteService.getPosts()
          .then((posts) => {
            const data = posts.documents || [];
            localStorage.setItem('postData', JSON.stringify(data));
            return data;
          })
          .catch((error) => {
            console.error('Error fetching posts:', error);
            return [];
          });
  
        if (userData) {
          dispatch(getPost(postData));
          dispatch(authLogin({userData}));

          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false once login completes or fails
    }
  };

  return (
    <div className="mt-[-30px] relative flex items-center justify-center w-full h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-white">Logging in...</p>
        </div>
      )}

      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
            Sign Up
          </Link>
        </p>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
