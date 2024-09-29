import React from "react";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { clearPosts } from "../../store/postSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

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
    <NavLink
      className="mt-1 md:p-3 py-1 block hover:bg-orange-700 focus:ring-4 focus:ring-gray-300 rounded-lg hover:text-white font-bold"
      onClick={logoutHandler}
    >
      LogoutBtn
    </NavLink>
  );
}

export default LogoutBtn;
