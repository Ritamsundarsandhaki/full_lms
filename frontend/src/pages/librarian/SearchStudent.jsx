import React, { useState } from "react";

const SearchStudent = () => {
  const [searchQuery, setSearchQuery] = useState({ fileNo: "", name: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

  const searchStudents = async (page = 1) => {
    setLoading(true);
    setMessage("");

    if (!searchQuery.fileNo && !searchQuery.name) {
      setMessage("❌ Please enter a File Number or Name to search.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/search?fileNo=${searchQuery.fileNo}&name=${searchQuery.name}&page=${page}&limit=5`
      );
      const data = await response.json();

      if (!data.success) {
        setMessage("⚠️ " + data.message);
        setStudents([]);
      } else {
        setStudents(data.students);
        setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages });
      }
    } catch (error) {
      setMessage("⚠️ Error fetching students. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="w-full max-w-3xl bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">🎓 Search Students</h2>

        {/* Search Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            name="fileNo"
            value={searchQuery.fileNo}
            onChange={handleChange}
            placeholder="🔍 Enter File Number"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition-all"
          />
          <input
            type="text"
            name="name"
            value={searchQuery.name}
            onChange={handleChange}
            placeholder="👨‍🎓 Enter Student Name"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition-all"
          />
          <button
            onClick={() => searchStudents(1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Searching..." : "🔎 Search"}
          </button>
        </div>

        {/* Display Messages */}
        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        {/* Students List */}
        <div className="space-y-4">
          {students.map((student, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-xl bg-white bg-opacity-90 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-800">👨‍🎓 {student.name}</h3>
              <p className="text-gray-600">📌 File No: <span className="font-bold text-blue-600">{student.fileNo}</span></p>
              <p className="text-gray-500">📧 {student.email}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => searchStudents(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
            >
              ◀ Prev
            </button>
            <span className="text-gray-800 text-lg font-semibold">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => searchStudents(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;
