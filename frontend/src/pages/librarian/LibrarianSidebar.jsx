import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, UserPlus, ClipboardList, RotateCcw, Search, User, LogOut 
} from "lucide-react";

const LibrarianSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation(); // Get current route

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-72"} 
        transition-transform md:translate-x-0 md:w-64 z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-gradient-to-r from-indigo-100 to-indigo-200">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-wide">📚 Librarian</h1>
        <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={toggleSidebar}>
          ✕
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="p-4 space-y-3">
        <SidebarLink to="/librarian/register-book" label="Register Book" icon={<BookOpen size={22} />} location={location} />
        <SidebarLink to="/librarian/register-student" label="Register Student" icon={<UserPlus size={22} />} location={location} />
        <SidebarLink to="/librarian/issuebook" label="Issue Book" icon={<ClipboardList size={22} />} location={location} />
        <SidebarLink to="/librarian/returnbook" label="Return Book" icon={<RotateCcw size={22} />} location={location} />
        <SidebarLink to="/librarian/searchbook" label="Search Book" icon={<Search size={22} />} location={location} />
        <SidebarLink to="/librarian/search-student" label="Search Student" icon={<Search size={22} />} location={location} />
        <SidebarLink to="/librarian/profile" label="Profile" icon={<User size={22} />} location={location} />

        {/* Logout Button */}
        <button className="mt-8 flex items-center w-full px-5 py-3 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 shadow-md">
          <LogOut size={22} className="mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

// Sidebar Link Component with Light Mode Styling
const SidebarLink = ({ to, label, icon, location }) => {
  const isActive = location.pathname === to; // Check if current route is active
  return (
    <Link
      to={to}
      className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 shadow-sm 
        ${isActive ? "bg-indigo-500 text-white" 
                   : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"}`}
    >
      {icon}
      <span className="ml-4 text-lg font-medium">{label}</span>
    </Link>
  );
};

export default LibrarianSidebar;
