import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/Axios"; // Import the Axios instance

// Custom Card Component
const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md transition-transform transform hover:scale-105 duration-300">
    {children}
  </div>
);

// Custom Skeleton Loader
const Skeleton = () => (
  <div className="w-full h-36 bg-gray-200 animate-pulse rounded-lg"></div>
);

// Custom Avatar Component
const Avatar = ({ src, alt, fallback }) => (
  <div className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden flex items-center justify-center text-white text-2xl font-bold bg-gray-400">
    {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : fallback}
  </div>
);

function Profile() {
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/librarian/profile"); // Use axiosInstance
        setLibrarian(response.data.librarian);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (!librarian) {
    return <p className="text-red-500 text-center text-lg font-semibold">⚠️ Failed to load profile.</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Card>
        <div className="flex flex-col items-center gap-6">
          <Avatar
            src={librarian.avatar || "/default-avatar.png"}
            alt="Profile"
            fallback={librarian.name.charAt(0)}
          />
          <h2 className="text-2xl font-bold text-gray-800">{librarian.name}</h2>
          <p className="text-gray-600 text-lg">{librarian.email}</p>
          <p className="text-gray-500 font-medium text-sm">📚 Role: Librarian</p>
          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            ✏️ Edit Profile
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
