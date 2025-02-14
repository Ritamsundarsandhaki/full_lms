import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHome from "./StudentHome";
import MyBooks from "./MyBooks";
import BookHistory from "./BookHisory";
import Profile from "./Profile";

const StudentDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="md:hidden p-3 bg-blue-600 text-white fixed top-4 left-4 rounded-md shadow-lg z-50"
        onClick={() => setSidebarOpen(true)}
      >
        Menu
      </button>

      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content with Increased Margin for Distance */}
      <div className="flex-1 px-8 py-6 md:ml-64 transition-all duration-300">
        {/* Welcome Section */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold">{greeting}, Student!</h1>
          <p className="text-lg mt-2">Here is your dashboard overview.</p>
        </div>

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <DashboardCard title="Books Borrowed" value="5" color="bg-green-500" />
          <DashboardCard title="Active Rentals" value="3" color="bg-blue-500" />
          <DashboardCard title="Membership Tier" value="A" color="bg-yellow-500" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <QuickActionCard title="View My Books" link="/student/my-books" color="bg-purple-600" />
          <QuickActionCard title="Check Book History" link="/student/book-history" color="bg-orange-500" />
          <QuickActionCard title="Edit Profile" link="/student/profile" color="bg-gray-700" />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Routes */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <Routes>
            <Route path="/dashboard" element={<StudentHome />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/book-history" element={<BookHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-md shadow-md text-white flex flex-col items-center ${color}`}>
    <p className="text-lg font-medium">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

// Quick Action Card Component
const QuickActionCard = ({ title, link, color }) => (
  <a
    href={link}
    className={`p-5 rounded-md shadow-md text-white text-center text-lg font-medium hover:opacity-90 transition duration-200 ${color}`}
  >
    {title}
  </a>
);

export default StudentDashboard;
