import Navbar from "./components/Navbar";
import PendingWashers from "./pages/PendingWashers";
import ApprovedWashers from "./pages/ApprovedWashers";
import Bookings from "./pages/Bookings";
import WasherBalances from "./pages/WasherBalances";
import PendingBookings from "./pages/PendingBookings";
import AutoDelete from "./pages/AutoDelete";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* 🔐 ADMIN GUARD */
const AdminGuard = ({ children }) => {
  const isAdmin = localStorage.getItem("admin");
  return isAdmin === "true"
    ? children
    : <Navigate to="/admin-login.html" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 PROTECTED ADMIN DASHBOARD */}
        <Route
          path="/*"
          element={
            <AdminGuard>

              {/* 🔥 AUTO DELETE (ADMIN ONLY) */}
              <AutoDelete />

              <Navbar />

              <Routes>
                <Route path="/" element={<PendingWashers />} />
                <Route path="/approved" element={<ApprovedWashers />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/balances" element={<WasherBalances />} />
                <Route path="/pending-bookings" element={<PendingBookings />} />
              </Routes>

            </AdminGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;