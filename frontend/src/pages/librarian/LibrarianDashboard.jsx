import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
import LibrarianSidebar from "./LibrarianSidebar";
import RegisterBook from "./RegisterBook";
import RegisterStudent from "./RegisterStudent";
import IssueBook from "./IssueBook";
import ReturnBook from "./ReturnBook";
import SearchBook from "./SearchBook";
import SearchStudent from "./SearchStudent";
import Profile from "./Profile";

const LibrarianDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [greeting, setGreeting] = useState("");
  const location = useLocation();

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Check if the current route is the base dashboard
  const isDashboard = location.pathname === "/librarian";

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <LibrarianSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 md:ml-64 transition-all duration-300">
        {/* Show Dashboard Overview when at /librarian */}
        {isDashboard && (
          <>
            {/* Welcome Section */}
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl flex flex-col items-center">
              <h1 className="text-3xl font-bold">{greeting}, Librarian!</h1>
              <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">Manage your library efficiently.</p>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <DashboardCard title="Total Books" value="500" color="bg-gradient-to-r from-green-400 to-green-600" />
              <DashboardCard title="Students Registered" value="200" color="bg-gradient-to-r from-blue-400 to-blue-600" />
              <DashboardCard title="Books Issued" value="75" color="bg-gradient-to-r from-yellow-400 to-yellow-600" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <QuickActionCard title="Register Book" link="register-book" color="bg-purple-600" />
              <QuickActionCard title="Register Student" link="register-student" color="bg-orange-500" />
              <QuickActionCard title="Issue Book" link="issuebook" color="bg-blue-700" />
              <QuickActionCard title="Return Book" link="returnbook" color="bg-red-500" />
              <QuickActionCard title="Search Book" link="searchbook" color="bg-teal-600" />
              <QuickActionCard title="Search Student" link="search-student" color="bg-indigo-600" />
              <QuickActionCard title="Edit Profile" link="profile" color="bg-gray-700" />
            </div>
          </>
        )}

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Routes (Other Pages) */}
        {!isDashboard && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
            <Routes>
              <Route path="register-book" element={<RegisterBook />} />
              <Route path="register-student" element={<RegisterStudent />} />
              <Route path="issuebook" element={<IssueBook />} />
              <Route path="returnbook" element={<ReturnBook />} />
              <Route path="searchbook" element={<SearchBook />} />
              <Route path="search-student" element={<SearchStudent />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Card Component (Glassmorphism Effect)
const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-lg text-white flex flex-col items-center ${color} bg-opacity-80 backdrop-blur-md`}>
    <p className="text-lg font-medium">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

// Quick Action Card Component (Modern Buttons)
const QuickActionCard = ({ title, link, color }) => (
  <Link to={link} className={`p-5 rounded-xl shadow-md text-white text-center text-lg font-medium hover:scale-105 transition transform duration-200 ${color}`}>
    {title}
  </Link>
);

export default LibrarianDashboard;
