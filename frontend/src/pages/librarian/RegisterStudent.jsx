import React, { useState } from "react";
import api from "../../components/Axios"; // Import the Axios instance

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    fileNo: "",
    parentName: "",
    mobile: "",
    department: "",
    branch: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const branches = ["CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.post("/api/librarian/register-student", formData);
      console.log(response)
      if (response.data.success) {
        setMessage({ type: "success", text: "✅ Student registered successfully!" });
        setFormData({
          name: "",
          email: "",
          password: "",
          fileNo: "",
          parentName: "",
          mobile: "",
          department: "",
          branch: "",
        });
      } else {
        setMessage({ type: "error", text: `⚠️ ${response.data.message}` });
      }
    } catch (error) {
      setMessage({ type: "error", text: "⚠️ Server error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4 sm:p-6">
      <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">🎓 Register Student</h2>

        {message.text && (
          <p className={`p-4 text-center rounded-lg font-medium text-lg transition-all duration-300 
            ${message.type === "success" ? "bg-green-100 text-green-800 border border-green-400" 
            : "bg-red-100 text-red-800 border border-red-400"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <InputField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
          <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (min 6 chars)" required />
          <InputField type="text" name="fileNo" value={formData.fileNo} onChange={handleChange} placeholder="File No (5-digit)" required />
          <InputField type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Parent Name" required />
          <InputField type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile (10-digit)" required />
          <InputField type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required />

          {/* Branch Selection Dropdown */}
          <div className="relative">
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 
                         focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-gray-100"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       hover:from-indigo-600 hover:to-pink-600 hover:scale-105 active:scale-95 disabled:opacity-50
                       transition-all duration-200 flex justify-center items-center shadow-lg"
          >
            {loading ? <LoadingSpinner /> : "🚀 Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ type, name, value, onChange, placeholder, required }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 
               focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-gray-100 hover:shadow-md text-sm sm:text-base"
  />
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="w-6 h-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
  </svg>
);

export default RegisterStudent;
