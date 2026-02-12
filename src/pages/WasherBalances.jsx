import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function WasherBalances() {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const balanceRef = ref(database, "washerBalances");

    onValue(balanceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];

      for (let id in data) {
        list.push({
          id,
          phone: data[id].phone,
          netBalance: data[id].netBalance,
          washerId: data[id].washerId,
        });
      }

      setBalances(list);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Washer Balances</h2>

      {balances.length === 0 ? (
        <p>No balance data</p>
      ) : (
        balances.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 15,
            }}
          >
            <p><b>Phone:</b> {b.phone}</p>
            <p><b>Balance:</b> ₹{b.netBalance}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default WasherBalances;