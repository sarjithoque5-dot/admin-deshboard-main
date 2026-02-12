import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // 1️⃣ Load users (phone yahin se aayega)
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      setUsers(snapshot.val() || {});
    });

    // 2️⃣ Load bookings
    const bookingsRef = ref(database, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];

      for (let id in data) {
        if (data[id].status === "accepted") {
          list.push({ id, ...data[id] });
        }
      }

      setBookings(list);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Accepted / Ongoing Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => {
          const phone = users[b.userId]?.phone || "Not available";

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #ccc",
                padding: 15,
                marginBottom: 15,
                borderRadius: 8,
                background: "#f9f9f9",
              }}
            >
              <p><b>Vehicle:</b> {b.vehicleType}</p>
              <p><b>Amount:</b> ₹{b.amount}</p>

              <p>
                <b>Customer Phone:</b> {phone}
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

export default Bookings;