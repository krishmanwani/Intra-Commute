export default function RideCard({ ride }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-3 w-80">
      <h3 className="text-xl font-bold">{ride.destination}</h3>
      <p className="text-gray-600">Pickup: {ride.pickup}</p>
      <p className="text-gray-600">Date: {ride.date} | Time: {ride.time}</p>
      <p className="text-green-600 font-bold">₹{ride.price}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700">
        Book Now
      </button>
    </div>
  );
}
