import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function PendingBookings() {
  const [bookings, setBookings] = useState([]);
  const [washers, setWashers] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    // ---------- 1️⃣ Load Pending Bookings ----------
    onValue(ref(database, "bookings"), (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];

      for (let id in data) {
        if (data[id].status === "pending") {
          list.push({ id, ...data[id] });
        }
      }

      setBookings(list);
    });

    // ---------- 2️⃣ Load Washers ----------
    onValue(ref(database, "washers"), (snap) => {
      setWashers(snap.val() || {});
    });

    // ---------- 3️⃣ Load Users (SAFE FLATTEN FIX) ----------
    onValue(ref(database, "users"), (snap) => {
      const raw = snap.val() || {};
      const clean = {};

      const traverse = (obj) => {
        Object.keys(obj).forEach((key) => {
          const val = obj[key];

          // अगर inside user object ही है
          if (val && typeof val === "object" && val.phone) {
            clean[key] = val;
          }

          // अगर nested object है तो अंदर जाओ
          if (val && typeof val === "object" && !val.phone) {
            traverse(val);
          }
        });
      };

      traverse(raw);
      setUsers(clean);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Pending Bookings</h2>

      {bookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        bookings.map((b) => {
          const washer = washers[b.washerId];

          const cleanedUserId = (b.userId || "").trim();
          const customer = users[cleanedUserId];

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #ccc",
                padding: 15,
                marginBottom: 15,
                borderRadius: 8,
                background: "#fafafa",
              }}
            >
              {/* VEHICLE + AMOUNT */}
              <p><b>Vehicle:</b> {b.vehicleType}</p>
              <p><b>Amount:</b> ₹{b.amount}</p>

              {/* DATE & TIME */}
              <p><b>Booking Date:</b> {b.date}</p>
              <p><b>Booking Time:</b> {b.time}</p>

              <hr />

              {/* WASHER DETAILS */}
              <p><b>Washer Name:</b> {washer ? washer.name : "Not Assigned"}</p>
              <p><b>Washer Phone:</b> {washer ? washer.phone : "N/A"}</p>

              <hr />

              {/* CUSTOMER DETAILS */}
              <p><b>Customer Phone:</b> {customer ? customer.phone : "N/A"}</p>

              <p>
                <b>Status:</b>{" "}
                <span style={{ color: "orange" }}>{b.status}</span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PendingBookings;