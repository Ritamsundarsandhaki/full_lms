import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/Axios";

const MyBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const response = await axiosInstance.get("/api/student/issued-books");
        console.log(response);
        if (response.data.success) {
          setIssuedBooks(response.data.issuedBooks);
        } else {
          throw new Error("Failed to fetch issued books");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssuedBooks();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      <p className="text-gray-600 dark:text-gray-300">List of currently borrowed books.</p>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 border">Book ID</th>
              <th className="p-2 border">Issue Date</th>
              <th className="p-2 border">Return Date</th>
              <th className="p-2 border">Returned</th>
              <th className="p-2 border">Fine</th>
            </tr>
          </thead>
          <tbody>
            {issuedBooks.map((book, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{book.bookId?.bookId || "N/A"}</td>
                <td className="p-2 border">{new Date(book.bookId.issueDate).toLocaleDateString()}</td>
                <td className="p-2 border">
                  {book.bookId.returnDate ? new Date(book.bookId.returnDate).toLocaleDateString() : "Not Returned"}
                </td>
                <td className="p-2 border">{book.bookId.returned ? "Yes" : "No"}</td>
                <td className="p-2 border text-red-500">₹{book.fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBooks;
