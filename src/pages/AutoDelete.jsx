import { useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "../firebase/firebaseconfig";

function AutoDelete() {

  useEffect(() => {

    const autoCleaner = async () => {
      try {
        const now = Date.now();

        const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
        const FIFTEEN_MIN = 15 * 60 * 1000;

        const bookingSnap = await get(ref(database, "bookings"));
        const paymentSnap = await get(ref(database, "paymentStatus"));

        // RULE 1 & 2: pending / accepted > 3 days
        if (bookingSnap.exists()) {
          bookingSnap.forEach((child) => {

            const bookingId = child.key;
            const booking = child.val();
            const createdAt = booking.createdAt || 0;

            const isExpired =
              (booking.status === "pending" ||
               booking.status === "accepted") &&
              now - createdAt >= THREE_DAYS;

            if (isExpired) {
              remove(ref(database, "bookings/" + bookingId));
              remove(ref(database, "paymentStatus/" + bookingId));
              remove(ref(database, "acceptedBookings/" + bookingId));

              console.log("Deleted old booking:", bookingId);
            }
          });
        }

        // RULE 3: fully confirmed + balance applied
        if (paymentSnap.exists()) {
          paymentSnap.forEach((child) => {

            const bookingId = child.key;
            const data = child.val();
            const confirmedAt = data.confirmedAt || 0;

            const isConfirmed =
              data.customerConfirm === true &&
              data.washerConfirm === true &&
              data.balanceApplied === true &&
              now - confirmedAt >= FIFTEEN_MIN;

            if (isConfirmed) {
              remove(ref(database, "paymentStatus/" + bookingId));
              remove(ref(database, "bookings/" + bookingId));
              remove(ref(database, "acceptedBookings/" + bookingId));

              console.log("Deleted confirmed booking:", bookingId);
            }
          });
        }

      } catch (err) {
        console.error("AutoDelete error:", err);
      }
    };

    autoCleaner();
    const timer = setInterval(autoCleaner, 30000);
    return () => clearInterval(timer);

  }, []);

  return null;
}

export default AutoDelete;