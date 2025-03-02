import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
// import { logout } from '../store/slices/authSlice';
import {
  Calendar,
  LogOut,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setIsAuthenticated } from "../store/slices/authSlice";
interface NavbarProps {
  onAddEvent: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddEvent }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setIsAuthenticated(false));
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>; // 👈 Explicitly cast error as AxiosError
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <nav
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <Calendar size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">
                EventMaster
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div
                className={`relative rounded-full transition-all duration-300 ${
                  searchFocused ? "w-80 bg-white shadow-md" : "w-64 bg-gray-100"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    size={18}
                    className={`${
                      searchFocused ? "text-indigo-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="block w-full py-2 pl-10 pr-3 rounded-full bg-transparent focus:outline-none"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {user?.role === "admin" && (
              <button
                onClick={onAddEvent}
                className="flex items-center text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                <PlusCircle size={18} className="mr-1" />
                Add Event
              </button>
            )}

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                  {user?.fullName?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
          <div className="px-3 py-2">
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={onAddEvent}
              className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Event
            </button>
          )}

          <button className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            <Bell size={18} className="mr-2" />
            Notifications
          </button>

          <button className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            <UserIcon size={18} className="mr-2" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
