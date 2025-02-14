import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="w-full p-6 bg-blue-600 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">Welcome to Library Management System 📚</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center mt-10">
        <p className="text-gray-700 text-lg text-center px-4 max-w-lg">
          A modern and efficient way to manage books, librarians, and students. 
          Login to access your dashboard.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            Login
          </Link>
          <Link to="/about" className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition">
            About Us
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} Library Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
