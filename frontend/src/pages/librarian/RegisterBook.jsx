import React, { useState } from "react";
import { jsPDF } from "jspdf";
import api from "../../components/Axios";

const BookRegistration = () => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    details: "",
    stock: "",
    price: "",
    course: "",
    branch: "",
  });
  const [registeredBooks, setRegisteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");

    const { title, author, details, stock, price, course, branch } = bookData;
    if (!title || !author || !details || !stock || !price || !course || !branch) {
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
        setBookData({ title: "", author: "", details: "", stock: "", price: "", course: "", branch: "" });
      }
    } catch (error) {
      setErrorMessage("⚠️ Error registering book. Try again later.");
    }

    setLoading(false);
  };

  const generatePDF = async () => {
    setPdfLoading(true);
    const doc = new jsPDF();
    let y = 10;
    let x = 10;
    let barcodesPerRow = 3; // Two barcodes per row
    let count = 0;
  
    for (let book of registeredBooks) {
      const barcodeUrl = `https://barcodeapi.org/api/code128/${book.bookId}`;
  
      try {
        const img = new Image();
        img.src = barcodeUrl;
  
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
  
        doc.addImage(img, "PNG", x, y, 50, 20);
        x += 60; // Move to the right for next barcode
  
        count++;
  
        if (count % barcodesPerRow === 0) {
          x = 10;
          y += 30; // Move down to next row
        }
  
        if (count % 10 === 0) {
          doc.addPage();
          x = 10;
          y = 10;
        }
      } catch (error) {
        console.error(`Error loading barcode for book ID ${book.bookId}`);
      }
    }
  
    doc.save("Library_Barcodes.pdf");
    setPdfLoading(false);
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6">📚 Register a New Book</h2>
        <div className="grid grid-cols-2 gap-4">
          {["title", "author", "details", "stock", "price", "course", "branch"].map((field) => (
            <input
              key={field}
              type={field === "stock" || field === "price" ? "number" : "text"}
              name={field}
              value={bookData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          ))}
        </div>
        <button
          onClick={handleRegister}
          className="mt-6 w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "🔄 Registering..." : "✅ Register Book"}
        </button>
        {errorMessage && <p className="text-center text-red-600 font-semibold mt-4">{errorMessage}</p>}
        {registeredBooks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">📋 Registered Books</h3>
            <button
              onClick={generatePDF}
              className="mb-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:scale-105 transition-all disabled:opacity-50"
              disabled={pdfLoading}
            >
              {pdfLoading ? "⏳ Generating PDF..." : "📄 Download All Barcodes as PDF"}
            </button>
            <div className="grid grid-cols-2 gap-4">
              {registeredBooks.map((book) => (
                <div key={book.bookId} className="p-4 border rounded-xl bg-white shadow-md">
                  <h4 className="text-lg font-semibold">📖 {book.title}</h4>
                  <p className="text-gray-600">🆔 ID: <span className="font-bold text-blue-600">{book.bookId}</span></p>
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    📊 View Barcode
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">📊 Barcode for {selectedBook.bookId}</h2>
            <img src={`https://barcodeapi.org/api/code128/${selectedBook.bookId}`} alt="Book Barcode" />
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
