import React, { useEffect, useState } from "react";
import AuthForm from "../components/AuthForm";
import { Calendar } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
];

const Auth: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Left side - Image and branding */}
      <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center p-8 text-white bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-900">
        {/* Floating Calendar Icon */}
        <div className="flex justify-center mb-6 animate-bounce">
          <div className="bg-white bg-opacity-20 p-4 rounded-full shadow-lg backdrop-blur-md">
            <Calendar size={64} />
          </div>
        </div>

        <div className="max-w-md text-center">
          <h1 className="text-6xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            EventMaster
          </h1>
          <p className="text-xl mb-8 opacity-90 font-light tracking-wide">
            Discover and manage events effortlessly
          </p>
        </div>

        {/* Image with overlay */}
        <div className="relative w-full max-w-sm mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70 rounded-lg"></div>
          <div className="relative overflow-hidden rounded-lg shadow-xl h-64">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Event ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Event stats with Glassmorphism */}
        <div className="mt-12 hidden md:flex justify-center space-x-6">
          {[
            { count: "10,000+", label: "Events Created" },
            { count: "50,000+", label: "Active Users" },
            { count: "100+", label: "Countries" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg backdrop-blur-md border border-white/20 hover:scale-105 transition transform duration-300"
            >
              <p className="text-xl font-bold">{stat.count}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full md:w-1/2 flex justify-center px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
              Welcome to EventMaster
            </h2>
            <p className="text-gray-600 mt-2">
              Your personal event management hub
            </p>
          </div>
          {/* Auth form with glassmorphism effect */}
          <div className="">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
