import React, { useState } from "react";
import { jsPDF } from "jspdf";
import api from "../../components/Axios"; // Import the Axios instance

const BookRegistration = () => {
  const [bookData, setBookData] = useState({
    title: "",
    details: "",
    stock: "",
    price: "",
    course: "",
    branch: "",
  });
  const [registeredBooks, setRegisteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");

    const { title, details, stock, price, course, branch } = bookData;
    if (!title || !details || !stock || !price || !course || !branch) {
      setErrorMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/librarian/register-book", bookData);
      if (!response.data.success) {
        setErrorMessage(`⚠️ ${response.data.message}`);
      } else {
        setRegisteredBooks(response.data.book.books || []);
        setBookData({ title: "", details: "", stock: "", price: "", course: "", branch: "" });
      }
    } catch (error) {
      setErrorMessage("⚠️ Error registering book. Try again later.");
    }

    setLoading(false);
  };

  // 📌 Download Single Book Barcode
  const downloadBarcode = async (bookId) => {
    const barcodeUrl = `https://barcodeapi.org/api/code128/${bookId}`;
    try {
      const response = await fetch(barcodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Barcode_${bookId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading barcode:", error);
    }
  };

  // 📄 Generate PDF with all book barcodes
  const generatePDF = async () => {
    const doc = new jsPDF();
    let y = 10;

    for (let book of registeredBooks) {
      const barcodeUrl = `https://barcodeapi.org/api/code128/${book.bookId}`;
      
      try {
        // Fetch barcode image
        const img = new Image();
        img.src = barcodeUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        doc.text(`📖 Book: ${book.title}`, 10, y);
        doc.text(`🆔 ID: ${book.bookId}`, 10, y + 10);
        doc.addImage(img, "PNG", 10, y + 20, 80, 30);
        y += 60;

        // If the page is full, create a new page
        if (y > 250) {
          doc.addPage();
          y = 10;
        }
      } catch (error) {
        console.error(`Error loading barcode for book ID ${book.bookId}`);
      }
    }

    doc.save("Library_Barcodes.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">
      <div className="w-full max-w-3xl bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">📚 Register a New Book</h2>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          {["title", "details", "stock", "price", "course", "branch"].map((field, index) => (
            <input
              key={index}
              type={field === "stock" || field === "price" ? "number" : "text"}
              name={field}
              value={bookData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
            />
          ))}
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "🔄 Registering..." : "✅ Register Book"}
        </button>

        {/* Error Message */}
        {errorMessage && <p className="text-center text-red-600 font-semibold mt-4">{errorMessage}</p>}

        {/* Registered Books Display */}
        {registeredBooks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Registered Books</h3>
            <button
              onClick={generatePDF}
              className="mb-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:scale-105 transition-all"
            >
              📄 Download All Barcodes as PDF
            </button>
            <div className="grid grid-cols-2 gap-4">
              {registeredBooks.map((book, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <h4 className="text-lg font-semibold text-gray-800">📖 {book.title || "Untitled"}</h4>
                  <p className="text-gray-600">🆔 ID: <span className="font-bold text-blue-600">{book.bookId}</span></p>
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-all"
                  >
                    📊 View Barcode
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Barcode Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">📊 Barcode for {selectedBook.bookId}</h2>
            <img
              src={`https://barcodeapi.org/api/code128/${selectedBook.bookId}`}
              alt="Book Barcode"
              className="mx-auto w-full h-auto border border-gray-300 rounded-lg"
            />
            <button onClick={() => setSelectedBook(null)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRegistration;
