import React, { useState } from "react";

const SearchBook = () => {
  const [searchQuery, setSearchQuery] = useState({ bookId: "", title: "" });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

  const searchBooks = async (page = 1) => {
    setLoading(true);
    setMessage("");

    if (!searchQuery.bookId && !searchQuery.title) {
      setMessage("❌ Please enter a Book ID or Title to search.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/search?bookId=${searchQuery.bookId}&title=${searchQuery.title}&page=${page}&limit=5`
      );
      const data = await response.json();

      if (!data.success) {
        setMessage("⚠️ " + data.message);
        setBooks([]);
      } else {
        setBooks(data.books);
        setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages });
      }
    } catch (error) {
      setMessage("⚠️ Error fetching books. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-3xl bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">📚 Search Books</h2>

        {/* Search Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            name="bookId"
            value={searchQuery.bookId}
            onChange={handleChange}
            placeholder="🔍 Enter Book ID"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition-all"
          />
          <input
            type="text"
            name="title"
            value={searchQuery.title}
            onChange={handleChange}
            placeholder="📖 Enter Book Title"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition-all"
          />
          <button
            onClick={() => searchBooks(1)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Searching..." : "🔎 Search"}
          </button>
        </div>

        {/* Display Messages */}
        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        {/* Books List */}
        <div className="space-y-4">
          {books.map((book, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-xl bg-white bg-opacity-90 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-gray-800">📖 {book.title}</h3>
              <p className="text-gray-600">📌 Book ID: <span className="font-bold text-indigo-600">{book.bookId}</span></p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => searchBooks(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
            >
              ◀ Prev
            </button>
            <span className="text-gray-800 text-lg font-semibold">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => searchBooks(pagination.currentPage + 1)}
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

export default SearchBook;
