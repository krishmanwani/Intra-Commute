import React from 'react';

function AvailabilityToggle({ isAvailable, onToggle }) {
  return (
    <div>
      <h3>Availability</h3>
      <p><strong>Status:</strong> {isAvailable ? "Available" : "Unavailable"}</p>
      <button 
        onClick={onToggle} 
        style={{
          background: isAvailable ? "#ff4d4f" : "#4CAF50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>
    </div>
  );
}

export default AvailabilityToggle;
