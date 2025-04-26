import React, { useState } from "react";
import { X, LogOut, MessageSquare, UserCircle2, Menu } from "lucide-react";
import profile from "../../public/profile.jpeg";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Cookies from "js-cookie"; // ✅ Correct import for frontend!

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true); // sidebar toggle state

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNewChat = () => {
    console.log("New chat started");
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4002/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      // ✅ Correct logout logic
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Cookies.remove("jwt"); // remove jwt token from cookies
      alert(data.message);
      setAuthUser(null);
      navigate("/login");
      window.location.reload(); // optional but good practice to refresh everything
    } catch (error) {
      alert(
        error?.response?.data?.errors || "Logout failed. Please try again."
      );
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-700 text-white h-screen p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {isOpen && <div className="text-2xl font-bold">Deepseek</div>}
        <button
          onClick={handleToggle}
          className="text-gray-400 hover:text-white ml-auto"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* History */}
      <div className="flex overflow-y-auto flex-col flex-grow space-y-4">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-sm justify-center md:justify-start"
        >
          <MessageSquare size={20} />
          {isOpen && "+ New Chat"}
        </button>

        {isOpen && (
          <div className="text-gray-400 text-sm mt-20 text-center">
            No chat history yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer justify-center md:justify-start">
          <img
            src={profile}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          {isOpen && (
            <span className="text-sm">
              {user ? user.firstName : "My Profile"}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-sm justify-center md:justify-start"
        >
          <LogOut size={20} />
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
