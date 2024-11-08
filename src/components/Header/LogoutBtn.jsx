import React, { useState } from "react";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { clearPosts } from "../../store/postSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logoutHandler = () => {
    setLoading(true);
    authService.logout()
      .then(() => {
        dispatch(logout());
        dispatch(clearPosts());
        localStorage.removeItem('postData');
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-white">Logging out...</p>
        </div>
      )}
      <NavLink
        className="mt-1 md:p-3 py-1 block hover:bg-orange-700 focus:ring-4 focus:ring-gray-300 rounded-lg hover:text-white font-bold"
        onClick={logoutHandler}
        disabled={loading}
      >
        Logout
      </NavLink>
    </>
  );
}

export default LogoutBtn;
