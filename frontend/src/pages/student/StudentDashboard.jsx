import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axiosInstance from "../../components/Axios";
import StudentSidebar from "./StudentSidebar";
import StudentHome from "./StudentHome";
import MyBooks from "./MyBooks";
import Profile from "../student/Profile";
import BookHistory from "./BookHisory";

const StudentDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [greeting, setGreeting] = useState("");
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get("/api/student/profile");
        if (response.data.success) {
          setStudentData(response.data.student);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 px-3 py-2 bg-blue-600 text-white rounded-md shadow-md text-sm"
        onClick={() => setSidebarOpen(true)}
      >
        Open Menu
      </button>

      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 md:ml-64 transition-all duration-300">
        
        {/* Profile & Greeting Section */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-700 dark:to-gray-800 shadow-md rounded-lg text-center flex flex-col items-center">
          <img 
            src="https://via.placeholder.com/90" 
            alt="Profile" 
            className="w-20 h-20 rounded-full mb-3 border-4 border-white shadow-lg"
          />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {greeting}, {studentData ? studentData.name : "Student"}! 🎉
          </h1>
          <p className="text-md text-gray-700 dark:text-gray-300 mt-2">
            Welcome back! Explore your dashboard.
          </p>
        </div>

        {/* Dashboard Stats (Centered) */}
        <div className="flex flex-col items-center sm:grid sm:grid-cols-2 gap-6 mb-6">
          <DashboardCard title="Books Borrowed" value={studentData ? studentData.issuedBooks.length : 0} color="from-green-400 to-green-600" />
          <DashboardCard title="Membership Tier" value={studentData ? studentData.department : "-"} color="from-yellow-400 to-yellow-600" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
          <QuickActionCard title="View My Books" link="/student/my-books" color="from-purple-500 to-purple-700" />
          <QuickActionCard title="Check Book History" link="/student/book-history" color="from-orange-500 to-orange-700" />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-600 transition-all shadow-md"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          <Routes>
            <Route path="/dashboard" element={<StudentHome />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/book-history" element={<BookHistory />} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// 📌 **Dashboard Stat Cards (Optimized UI)**
const DashboardCard = ({ title, value, color }) => (
  <div className={`w-64 sm:w-full p-6 rounded-lg shadow-lg text-white text-center text-md bg-gradient-to-br ${color} hover:scale-105 transition-all duration-200`}>
    <p className="font-medium">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

// 📌 **Quick Action Cards (Compact & Stylish)**
const QuickActionCard = ({ title, link, color }) => (
  <Link
    to={link}
    className={`p-4 rounded-md shadow-md text-white text-center text-sm font-medium bg-gradient-to-br ${color} hover:scale-105 transition-all duration-200`}
  >
    {title}
  </Link>
);

export default StudentDashboard;
