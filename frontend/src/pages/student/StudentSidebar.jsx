import React from "react";
import { NavLink } from "react-router-dom";

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Student Panel</h2>
        <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
          ✖
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-4">
        <SidebarLink to="/student/dashboard" label="Dashboard" />
        <SidebarLink to="/student/my-books" label="My Books" />
        <SidebarLink to="/student/book-history" label="Book History" />
        <SidebarLink to="/student/profile" label="Profile" />
      </nav>
    </div>
  );
};

// Reusable Sidebar Link Component
const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-6 py-3 text-gray-700 hover:bg-gray-100 transition ${
        isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
      }`
    }
  >
    {label}
  </NavLink>
);

export default StudentSidebar;
