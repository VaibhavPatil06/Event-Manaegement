import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setIsAuthenticated, setUser } from "../store/slices/authSlice.js";
import { encrypt } from "../helper/encryptPassword.js";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 6 characters, include one uppercase, one lowercase, one number, and one symbol.",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    }
  };

  // Full name validation
  const validateFullName = (fullName: string) => {
    if (fullName.trim().length === 0) {
      setErrors((prev) => ({ ...prev, fullName: "Full name is required" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, fullName: "" }));
      return true;
    }
  };

  // Handle login form submission
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(loginForm.email)) return;
    if (!validatePassword(loginForm.password)) return;

    setLoading(true);
    try {
      const encryptedPassword = await encrypt(loginForm.password);
      const data = {
        email: loginForm.email,
        password: encryptedPassword,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/login`,
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Login successful");
        dispatch(setUser(response.data.data));
        dispatch(setIsAuthenticated(true));
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup form submission
  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFullName(signupForm.fullName)) return;
    if (!validateEmail(signupForm.email)) return;
    if (!validatePassword(signupForm.password)) return;

    setLoading(true);
    try {
      const encryptedPassword = await encrypt(signupForm.password);
      const data = {
        fullName: signupForm.fullName,
        email: signupForm.email,
        role: signupForm.role || "user",
        password: encryptedPassword,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/register-user`,
        data
      );
      if (response.data.success) {
        toast.success(response.data.message || "User registered successfully");
        setIsLogin(true);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSignupForm({
      fullName: "",
      email: "",
      password: "",
      role: "user",
    });
    setLoginForm({
      email: "",
      password: "",
    });
    setErrors({
      email: "",
      password: "",
      fullName: "",
    });
  };

  return (
    <div className="w-full">
      <div className={`flip-card ${isLogin ? "" : "flipped"}`}>
        <div className="flip-card-inner">
          {/* Login Form */}
          <div className="flip-card-front bg-white px-8 lg:mt-32 rounded-lg">
            <h2 className="text-2xl pt-4 font-bold mb-2 text-center gradient-text">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Sign in to continue to your account
            </p>
            <form>
              <div className="mb-4 input-container">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="input-field"
                    id="email"
                    type="email"
                    placeholder=""
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      validateEmail(e.target.value);
                    }}
                    required
                  />
                  <label className="input-label" htmlFor="email">
                    Email
                  </label>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-6 input-container">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="input-field"
                    id="password"
                    type="password"
                    placeholder=""
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      validatePassword(e.target.value);
                    }}
                    required
                  />
                  <label className="input-label" htmlFor="password">
                    Password
                  </label>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all duration-300 flex items-center justify-center pulse-on-hover"
                  type="submit"
                  onClick={handleSubmitLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign In
                      <ArrowRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">
                    Or
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 pb-4">
                Don't have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>

          {/* Register Form */}
          <div className="flip-card-back bg-white lg:mt-10 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-center gradient-text">
              Create Account
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Join our community today
            </p>
            <form>
              <div className="mb-4 w-full">
                <div className="toggle-container w-full">
                  <button
                    type="button"
                    className={`toggle-button ${
                      signupForm.role === "user" ? "active" : ""
                    }`}
                    onClick={() =>
                      setSignupForm((prev) => ({
                        ...prev,
                        role: "user",
                      }))
                    }
                  >
                    User
                  </button>
                  <button
                    type="button"
                    className={`toggle-button ${
                      signupForm.role === "admin" ? "active" : ""
                    }`}
                    onClick={() =>
                      setSignupForm((prev) => ({
                        ...prev,
                        role: "admin",
                      }))
                    }
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div className="mb-4 input-container">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="input-field"
                    id="name"
                    type="text"
                    placeholder=""
                    value={signupForm.fullName}
                    onChange={(e) => {
                      setSignupForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }));
                      validateFullName(e.target.value);
                    }}
                    required
                  />
                  <label className="input-label" htmlFor="name">
                    Full Name
                  </label>
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="mb-4 input-container">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="input-field"
                    id="register-email"
                    type="email"
                    placeholder=""
                    value={signupForm.email}
                    onChange={(e) => {
                      setSignupForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      validateEmail(e.target.value);
                    }}
                    required
                  />
                  <label className="input-label" htmlFor="register-email">
                    Email
                  </label>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-6 input-container">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-indigo-500" />
                  </div>
                  <input
                    className="input-field"
                    id="register-password"
                    type="password"
                    placeholder=""
                    value={signupForm.password}
                    onChange={(e) => {
                      setSignupForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      validatePassword(e.target.value);
                    }}
                    required
                  />
                  <label className="input-label" htmlFor="register-password">
                    Password
                  </label>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all duration-300 flex items-center justify-center pulse-on-hover"
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmitSignup}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create Account
                      <ArrowRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">
                    Or
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeft size={16} className="mr-1" />
                    Sign In
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthForm;
