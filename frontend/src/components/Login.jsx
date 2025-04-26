import axios from "axios";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlesignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error first
    setLoading(true);

    // Validate fields
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/user/login",
        formData,
        { withCredentials: true }
      );
      console.log(data);

      alert(data.message || "Signup successful!");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setAuthUser(data.token);

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        {/* Signup Form */}
        <form className="space-y-5" onSubmit={handlesignup}>
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              <Eye size={18} />
            </span>
          </div>

          {/* Error Message */}
          {error && <span className="text-red-400 text-sm">{error}</span>}

          {/* Terms and Conditions */}
          <p className="text-gray-400 text-xs mt-2">
            By signing up or logging in, you consent to Deepseek's{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded text-white font-semibold"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          {/* Link to Login */}
          <div className="text-center mt-4 text-sm flex justify-between">
            <span className="text-gray-400">Haven't account? </span>
            <Link to="/signup" className="text-blue-400 hover:underline">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
