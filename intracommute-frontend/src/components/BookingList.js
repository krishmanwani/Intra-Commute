import React from 'react';

function BookingList({ bookings, onAccept, onReject }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Upcoming Bookings
      </h3>
      {bookings.length > 0 ? (
        <ul style={{ paddingLeft: "1rem" }}>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: "1rem" }}>
              <p><strong>Passenger:</strong> {booking.passengerName}</p>
              <p>{booking.pickupLocation} ➡️ {booking.dropoffLocation}</p>
              <p><strong>Time:</strong> {new Date(booking.time).toLocaleString()}</p>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => onAccept(booking._id)}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    marginRight: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(booking._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming bookings.</p>
      )}
    </div>
  );
}

export default BookingList;
