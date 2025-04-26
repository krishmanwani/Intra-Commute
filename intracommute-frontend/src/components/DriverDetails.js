import React from 'react';

function DriverDetails({ driver }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3>Driver Details</h3>
      <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
      <p><strong>Email:</strong> {driver.email}</p>
      <p><strong>Phone:</strong> {driver.phone || "N/A"}</p>
      <p><strong>Vehicle Type:</strong> {driver.vehicleType || "N/A"}</p>
      <p><strong>Vehicle Number:</strong> {driver.vehicleNumber || "N/A"}</p>
    </div>
  );
}

export default DriverDetails;
