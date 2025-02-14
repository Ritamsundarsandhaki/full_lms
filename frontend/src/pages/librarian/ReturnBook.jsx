import React, { useState } from "react";

const ReturnBook = () => {
  const [formData, setFormData] = useState({
    fileNo: "",
    bookIds: [""], // Start with one book ID input field
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "fileNo") {
      setFormData({ ...formData, fileNo: value });
    } else {
      const updatedBookIds = [...formData.bookIds];
      updatedBookIds[index] = value;
      setFormData({ ...formData, bookIds: updatedBookIds });
    }
  };

  const addBookField = () => {
    setFormData({ ...formData, bookIds: [...formData.bookIds, ""] });
  };

  const removeBookField = (index) => {
    const updatedBookIds = formData.bookIds.filter((_, i) => i !== index);
    setFormData({ ...formData, bookIds: updatedBookIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation: Ensure book IDs are at least 5 digits
    if (formData.bookIds.some((id) => id.length < 5)) {
      setMessage({ type: "error", text: "Each Book ID must be at least 5 digits." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/books/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Book(s) returned successfully!" });
        setFormData({ fileNo: "", bookIds: [""] });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Return Book</h2>

        {message.text && (
          <p className={`p-3 text-center rounded-lg font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Number Input */}
          <InputField type="text" name="fileNo" value={formData.fileNo} onChange={handleChange} placeholder="Student File No" required />

          {/* Book ID Inputs */}
          {formData.bookIds.map((bookId, index) => (
            <div key={index} className="flex items-center space-x-2">
              <InputField
                type="text"
                name="bookId"
                value={bookId}
                onChange={(e) => handleChange(e, index)}
                placeholder="Book ID (Min 5 digits)"
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => removeBookField(index)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add More Books Button */}
          <button type="button" onClick={addBookField} className="w-full p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all">
            + Add Another Book
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 hover:from-green-500 hover:to-orange-500 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-200 flex justify-center items-center shadow-lg"
          >
            {loading ? <LoadingSpinner /> : "Return Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 🔹 Reusable Input Field Component
const InputField = ({ type, name, value, onChange, placeholder, required }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
  />
);

// 🔹 Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
  </svg>
);

export default ReturnBook;
