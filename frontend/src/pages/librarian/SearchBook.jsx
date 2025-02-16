import React, { useState } from "react";
import api from "../../components/Axios"; // Import the Axios instance

const SearchBook = () => {
  const [searchQuery, setSearchQuery] = useState({ bookId: "", title: "" });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const searchBooks = async (page = 1) => {
    if (!searchQuery.bookId.trim() && !searchQuery.title.trim()) {
      setMessage("❌ Please enter a Book ID or Title to search.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/api/librarian/search-book", {
        params: {
          bookId: searchQuery.bookId,
          title: searchQuery.title,
          page,
          limit: 5,
        },
      });

      if (response.data.success) {
        setBooks(response.data.books);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        setMessage(`⚠️ ${response.data.message}`);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setMessage("⚠️ Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">📚 Search Books</h2>

        {/* Search Input Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            name="bookId"
            value={searchQuery.bookId}
            onChange={handleChange}
            placeholder="🔍 Enter Book ID"
            className="p-3 border border-gray-300 rounded-lg w-full"
          />
          <input
            type="text"
            name="title"
            value={searchQuery.title}
            onChange={handleChange}
            placeholder="📖 Enter Book Title"
            className="p-3 border border-gray-300 rounded-lg w-full"
          />
          <button
            onClick={() => searchBooks(1)}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 hover:scale-105"}`}
          >
            {loading ? "🔄 Searching..." : "🔎 Search"}
          </button>
        </div>

        {/* Display Message */}
        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        {/* Display Books */}
        <div className="space-y-4">
          {books.map((book, index) => (
            <div key={index} className="p-6 border border-gray-300 rounded-xl bg-white shadow-md">
              <h3 className="text-xl font-semibold">📖 {book.title}</h3>
              <p>📌 <strong>Course:</strong> {book.course}</p>
              <p>🏢 <strong>Branch:</strong> {book.branch}</p>
              <p>💰 <strong>Price:</strong> ₹{book.price}</p>
              <p>📄 <strong>Details:</strong> {book.details}</p>
              <p>📅 <strong>Created At:</strong> {new Date(book.createdAt).toLocaleString()}</p>
              <p>📌 <strong>Updated At:</strong> {new Date(book.updatedAt).toLocaleString()}</p>

              {/* Display Multiple Copies of the Book */}
              <h4 className="mt-4 font-semibold">📚 Available Copies:</h4>
              <ul className="mt-2">
                {book.books.map((copy) => (
                  <li key={copy._id} className="flex justify-between border p-2 rounded-lg">
                    <span>📖 <strong>ID:</strong> {copy.bookId}</span>
                    <span className={copy.issued ? "text-red-500" : "text-green-500"}>
                      {copy.issued ? "🚫 Issued" : "✅ Available"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => searchBooks(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                pagination.currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              ◀ Prev
            </button>
            <span className="font-semibold">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => searchBooks(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                pagination.currentPage === pagination.totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBook;
