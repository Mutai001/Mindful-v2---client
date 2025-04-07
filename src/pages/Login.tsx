import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import loginBg from "../assets/images/lines.avif";
import logo from "../assets/images/login.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = "https://mindful-app-r8ur.onrender.com/api/auth/login";
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Invalid response from server");
      }

      // Store user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      // Show success toast
      toast.success(`Welcome back, ${data.user.full_name || 'User'}!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Redirect after toast shows
      setTimeout(() => {
        const userRole = data.user.role;
        if (userRole === "therapist") {
          navigate(`/therapist-dashboard/${data.user.id}`);
        } else if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 2500);

    } catch (error) {
      const errorMessage = error instanceof TypeError && error.message.includes("NetworkError") 
        ? "Cannot connect to server. Please check your connection."
        : error instanceof Error ? error.message : "An error occurred";
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center"
      >
        <motion.img 
          src={logo} 
          alt="Mindful Logo" 
          className="w-32 mx-auto mb-4"
          variants={itemVariants}
        />
        <motion.h2 
          className="text-2xl font-semibold text-green-700"
          variants={itemVariants}
        >
          Welcome Back
        </motion.h2>
        <motion.p 
          className="text-gray-500 mb-4"
          variants={itemVariants}
        >
          Sign in to continue
        </motion.p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div variants={itemVariants}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition flex justify-center items-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={loading}
            >
              {loading ? (
                <BeatLoader color="#ffffff" size={10} />
              ) : (
                "Login"
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.p 
          className="mt-4 text-gray-600"
          variants={itemVariants}
        >
          Don't have an account?{" "}
          <motion.span
            onClick={() => navigate("/register")}
            className="text-green-700 cursor-pointer hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;