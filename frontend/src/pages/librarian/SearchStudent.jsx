import React, { useState } from "react";
import api from "../../components/Axios";

const SearchStudent = () => {
  const [searchQuery, setSearchQuery] = useState({ fileNo: "", name: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedStudent, setSelectedStudent] = useState(null); // For modal

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
      const response = await api.get("/api/librarian/search-student", {
        params: { fileNo: searchQuery.fileNo, name: searchQuery.name, page, limit: 5 },
      });

      if (!response.data.success) {
        setMessage("⚠️ " + response.data.message);
        setStudents([]);
      } else {
        setStudents(response.data.students);
        setPagination({ currentPage: response.data.pagination.currentPage, totalPages: response.data.pagination.totalPages });
      }
    } catch (error) {
      setMessage("⚠️ Error fetching students. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">🎓 Search Students</h2>

        {/* Search Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            name="fileNo"
            value={searchQuery.fileNo}
            onChange={handleChange}
            placeholder="🔍 Enter File Number"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="name"
            value={searchQuery.name}
            onChange={handleChange}
            placeholder="👨‍🎓 Enter Student Name"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => searchStudents(1)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
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
            <div
              key={index}
              onClick={() => setSelectedStudent(student)}
              className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-800">👨‍🎓 {student.name}</h3>
              <p className="text-gray-600">📌 File No: <span className="font-bold text-blue-600">{student.fileNo}</span></p>
              <p className="text-gray-500">📧 {student.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
            >
              ✖
            </button>

            {/* Student Info */}
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedStudent.name}</h2>
            <p className="text-gray-700"><strong>📌 File No:</strong> {selectedStudent.fileNo}</p>
            <p className="text-gray-700"><strong>📧 Email:</strong> {selectedStudent.email}</p>
            <p className="text-gray-700"><strong>📞 Mobile:</strong> {selectedStudent.mobile}</p>
            <p className="text-gray-700"><strong>📚 Department:</strong> {selectedStudent.department} ({selectedStudent.branch})</p>

            {/* Issued Books Table */}
            <h3 className="text-lg font-semibold mt-4 text-gray-800">📖 Issued Books:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="p-2 border">Book ID</th>
                    <th className="p-2 border">Issue Date</th>
                    <th className="p-2 border">Return Date</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.issuedBooks.map((book, idx) => (
                    <tr key={idx} className="text-gray-700 text-center">
                      <td className="p-2 border">{book.bookId}</td>
                      <td className="p-2 border">{new Date(book.issueDate).toLocaleString()}</td>
                      <td className="p-2 border">
                        {book.returned ? new Date(book.returnDate).toLocaleString() : "⏳ Pending"}
                      </td>
                      <td className={`p-2 border font-bold ${book.returned ? "text-green-600" : "text-red-600"}`}>
                        {book.returned ? "✅ Returned" : "🚨 Not Returned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
