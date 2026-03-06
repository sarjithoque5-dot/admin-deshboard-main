import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function PendingBookings() {
const [bookings, setBookings] = useState([]);
const [washers, setWashers] = useState({});
const [users, setUsers] = useState({});
const [previousCount, setPreviousCount] = useState(0);

useEffect(() => {

// 🔔 Ask browser notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// ---------- 1️⃣ Load Pending Bookings ----------
const bookingsRef = ref(database, "bookings");

onValue(bookingsRef, (snapshot) => {
  const data = snapshot.val() || {};
  const list = [];

  for (let id in data) {
    if (data[id].status === "pending") {
      list.push({ id, ...data[id] });
    }
  }

  // 🚨 Detect new booking
  if (previousCount !== 0 && list.length > previousCount) {
    showNotification();
  }

  setPreviousCount(list.length);
  setBookings(list);
});

// ---------- 2️⃣ Load Washers ----------
onValue(ref(database, "washers"), (snap) => {
  setWashers(snap.val() || {});
});

// ---------- 3️⃣ Load Users ----------
onValue(ref(database, "users"), (snap) => {
  const raw = snap.val() || {};
  const clean = {};

  const traverse = (obj) => {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];

      if (val && typeof val === "object" && val.phone) {
        clean[key] = val;
      }

      if (val && typeof val === "object" && !val.phone) {
        traverse(val);
      }
    });
  };

  traverse(raw);
  setUsers(clean);
});

}, [previousCount]);

// 🔔 Notification function
const showNotification = () => {

if (Notification.permission === "granted") {

  new Notification("🚗 New Booking Received!", {
    body: "A customer placed a new washing order",
    icon: "https://cdn-icons-png.flaticon.com/512/743/743922.png"
  });

  // 🔊 Play alert sound
  const audio = new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
  );

  audio.play();
}

};

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
          {/* Vehicle + Amount */}
          <p><b>Vehicle:</b> {b.vehicleType}</p>
          <p><b>Amount:</b> ₹{b.amount}</p>

          {/* Date & Time */}
          <p><b>Booking Date:</b> {b.date}</p>
          <p><b>Booking Time:</b> {b.time}</p>

          <hr />

          {/* Washer Details */}
          <p><b>Washer Name:</b> {washer ? washer.name : "Not Assigned"}</p>
          <p><b>Washer Phone:</b> {washer ? washer.phone : "N/A"}</p>

          <hr />

          {/* Customer Details */}
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