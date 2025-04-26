import axios from "axios";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/user/signup",
        formData,
        { withCredentials: true }
      );

      alert(data.message || "Signup successful!");
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
          Create Account
        </h1>

        {/* Signup Form */}
        <form className="space-y-5" onSubmit={handlesignup}>
          {/* First Name */}
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Link to Login */}
          <div className="text-center mt-4 text-sm flex justify-between">
            <span className="text-gray-400">Already registered? </span>
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
