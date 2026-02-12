import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function PendingWashers() {
  const [washers, setWashers] = useState([]);

  useEffect(() => {
    const washersRef = ref(database, "washers");

    onValue(washersRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];

      for (let id in data) {
        if (data[id].status === "pending") {
          list.push({ id, ...data[id] });
        }
      }

      setWashers(list);
    });
  }, []);

  const approveWasher = (id) => {
    update(ref(database, "washers/" + id), {
      status: "approved",
    });
    alert("Washer Approved!");
  };

  const rejectWasher = (id) => {
    update(ref(database, "washers/" + id), {
      status: "rejected",
    });
    alert("Washer Rejected!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Pending Washers</h2>

      {washers.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 15,
            marginBottom: 20,
            borderRadius: 10,
            background: "#f7f7f7",
            border: "1px solid #ccc",
          }}
        >
          {/* PHOTO */}
          <img
            src={item.photoUrl}
            alt="Washer"
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 10,
            }}
          />

          {/* NAME + PHONE */}
          <h3 style={{ marginBottom: 5 }}>{item.name}</h3>
          <p style={{ margin: 0 }}>📞 {item.phone}</p>
          <p style={{ margin: "5px 0" }}>📍 {item.location}</p>

          {/* DESCRIPTION */}
          <p style={{ marginTop: 8 }}>{item.description}</p>

          {/* RATES */}
          <div style={{ marginTop: 10 }}>
            <p>🚗 Car: ₹{item.carRate}</p>
            <p>🏍 Bike: ₹{item.bikeRate}</p>
            <p>🚙 SUV: ₹{item.suvRate}</p>
          </div>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              onClick={() => approveWasher(item.id)}
              style={{
                flex: 1,
                padding: 10,
                background: "green",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Approve
            </button>

            <button
              onClick={() => rejectWasher(item.id)}
              style={{
                flex: 1,
                padding: 10,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingWashers;