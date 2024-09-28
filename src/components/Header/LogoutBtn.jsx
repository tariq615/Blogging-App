import React from "react";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { clearPosts } from "../../store/postSlice";
import { useDispatch } from "react-redux";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout()
      .then(() => {
        dispatch(logout());
        dispatch(clearPosts())
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      LogoutBtn
    </button>
  );
}

export default LogoutBtn;
