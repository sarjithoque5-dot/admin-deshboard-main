import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function PendingBookings() {
  const [bookings, setBookings] = useState([]);
  const [washers, setWashers] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    // 1️⃣ Get pending bookings
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

    // 2️⃣ Get all washers
    onValue(ref(database, "washers"), (snap) => {
      setWashers(snap.val() || {});
    });

    // 3️⃣ Get all users (customers)
    onValue(ref(database, "users"), (snap) => {
      setUsers(snap.val() || {});
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Pending Bookings (Manual Follow-up)</h2>

      {bookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        bookings.map((b) => {
          const washer = washers[b.washerId];
          const customer = users[b.userId];

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #ccc",
                padding: 15,
                marginBottom: 15,
                borderRadius: 8,
              }}
            >
              <p><b>Vehicle:</b> {b.vehicleType}</p>
              <p><b>Amount:</b> ₹{b.amount}</p>

              <hr />

              <p>
                <b>Washer Name:</b>{" "}
                {washer ? washer.name : "Not assigned"}
              </p>
              <p>
                <b>Washer Phone:</b>{" "}
                {washer ? washer.phone : "N/A"}
              </p>

              <hr />

              <p>
                <b>Customer Phone:</b>{" "}
                {customer ? customer.phone : "N/A"}
              </p>

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