import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function ApprovedWashers() {
  const [washers, setWashers] = useState([]);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    // Approved washers
    const washersRef = ref(database, "washers");
    onValue(washersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];

      for (let id in data) {
        if (data[id].status === "approved") {
          list.push({ id, ...data[id] });
        }
      }
      setWashers(list);
    });

    // Washer balances
    const balanceRef = ref(database, "washerBalances");
    onValue(balanceRef, (snapshot) => {
      setBalances(snapshot.val() || {});
    });
  }, []);

  // Reset balance function
  const resetBalance = async (washerId) => {
    const ok = window.confirm("Kya aap balance 0 karna chahte ho?");
    if (!ok) return;

    try {
      await update(ref(database, "washerBalances/" + washerId), {
        netBalance: 0,
        lastUpdated: Date.now(),
      });

      alert("Balance successfully 0 kar diya gaya");
    } catch (error) {
      console.error(error);
      alert("Balance reset me error aaya");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Approved Washers</h2>

      {washers.length === 0 ? (
        <p>No approved washers</p>
      ) : (
        washers.map((w) => {
          const balance = balances[w.id]?.netBalance ?? 0;

          return (
            <div
              key={w.id}
              style={{
                border: "1px solid green",
                padding: 15,
                marginBottom: 15,
                borderRadius: 8,
                background: "#f6fff6",
              }}
            >
              <h3>{w.name}</h3>
              <p>📞 {w.phone}</p>

              <p>
                💰 Balance:{" "}
                <b style={{ color: balance < 0 ? "red" : "green" }}>
                  ₹{balance}
                </b>
              </p>

              <button
                onClick={() => resetBalance(w.id)}
                style={{
                  marginTop: 10,
                  padding: "8px 14px",
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Reset Balance to 0
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ApprovedWashers;