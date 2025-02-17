import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/open/Home";
import Login from "./pages/open/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import Unauthorized from "./pages/open/Unauthorized";
import { AuthProvider, useAuth } from "./components/AuthContext";

// ✅ Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { token, userType } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userType)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

// ✅ Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["librarian"]} />}>
            <Route path="/librarian/*" element={<LibrarianDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/*" element={<StudentDashboard />} />
          </Route>


        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
