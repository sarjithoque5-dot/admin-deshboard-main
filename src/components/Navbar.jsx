import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        padding: 15,
        background: "#222",
        display: "flex",
        gap: 15
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Pending
      </Link>

      <Link to="/approved" style={{ color: "white", textDecoration: "none" }}>
        Approved
      </Link>

      <Link to="/bookings" style={{ color: "white", textDecoration: "none" }}>
        Bookings
      </Link>

      <Link to="/balances" style={{ color: "white", textDecoration: "none" }}>
        Washer Balances
      </Link>

      <Link to="/complaints" style={{ color: "white", textDecoration: "none" }}>
        Complaints
      </Link>

      <Link
  to="/pending-bookings"
  style={{ color: "white", textDecoration: "none" }}
>
  Pending Bookings
</Link>

    </div>
  );
}

export default Navbar;