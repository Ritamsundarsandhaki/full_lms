import React, { useState, useEffect } from "react";
import api from "../../components/Axios";

const SearchBook = () => {
  const [searchQuery, setSearchQuery] = useState({ bookId: "", title: "" });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [expandedBooks, setExpandedBooks] = useState({});

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.bookId || searchQuery.title) {
        searchBooks(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const searchBooks = async (page) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/api/librarian/search-book", {
        params: { bookId: searchQuery.bookId, title: searchQuery.title, page, limit: 5 },
      });

      if (response.data.success) {
        setBooks(response.data.books);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        setMessage("⚠️ No books found.");
        setBooks([]);
      }
    } catch (error) {
      setMessage("⚠️ Server error. Please try again.");
    }

    setLoading(false);
  };

  const fetchAllBooks = async (page = 1) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/api/librarian/getallbooks", { params: { page, limit: 5 } });

      if (response.data.success) {
        setBooks(response.data.books);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        setMessage("⚠️ No books found.");
        setBooks([]);
      }
    } catch (error) {
      setMessage("⚠️ Server error. Please try again.");
    }

    setLoading(false);
  };

  const toggleExpand = (index) => {
    setExpandedBooks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">📚 Search Books</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <input type="text" name="bookId" value={searchQuery.bookId} onChange={handleChange} placeholder="🔍 Book ID" className="p-3 border rounded-lg flex-1" disabled={loading} />
          <input type="text" name="title" value={searchQuery.title} onChange={handleChange} placeholder="📖 Book Title" className="p-3 border rounded-lg flex-1" disabled={loading} />
          <button onClick={() => searchBooks(1)} className="p-3 rounded-lg text-white font-semibold bg-indigo-500 hover:bg-indigo-600" disabled={loading}>{loading ? "🔄 Searching..." : "🔎 Search"}</button>
          <button onClick={() => fetchAllBooks(1)} className="p-3 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600" disabled={loading}>{loading ? "🔄 Fetching..." : "📚 Fetch All Books"}</button>
        </div>

        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {books.map((book, index) => (
            <div key={book._id} className="p-6 border rounded-xl bg-white shadow-md relative">
              <h3 className="text-xl font-semibold">📖 {book.title}</h3>
              <p className="text-gray-600">📌 <strong>Course:</strong> {book.course}</p>
              <p className="text-gray-600">🏢 <strong>Branch:</strong> {book.branch}</p>
              <p className="text-gray-600">💰 <strong>Price:</strong> ₹{book.price}</p>
              <p className="text-gray-600">📄 <strong>Details:</strong> {book.details}</p>
              <p className="text-gray-500 text-sm">📅 <strong>Added:</strong> {new Date(book.createdAt).toLocaleString()}</p>
              <button onClick={() => toggleExpand(index)} className="mt-4 text-blue-500 underline">{expandedBooks[index] ? "Hide Copies" : "Show Copies"}</button>
              {expandedBooks[index] && (
                <ul className="mt-3 space-y-2">
                  {book.books.map((copy) => (
                    <li key={copy._id} className="p-3 border rounded-lg flex justify-between">
                      <span>📖 <strong>ID:</strong> {copy.bookId}</span>
                      <span className={copy.issued ? "text-red-500" : "text-green-500"}>{copy.issued ? "🚫 Issued" : "✅ Available"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button onClick={() => fetchAllBooks(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || loading} className="p-3 bg-gray-400 text-white rounded-lg disabled:opacity-50">⬅️ Prev</button>
          <span className="p-3 font-semibold">Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button onClick={() => fetchAllBooks(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || loading} className="p-3 bg-gray-400 text-white rounded-lg disabled:opacity-50">Next ➡️</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBook;
