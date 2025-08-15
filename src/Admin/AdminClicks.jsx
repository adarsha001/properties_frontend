import React, { useEffect, useState } from "react";

const AdminClicks = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const token = localStorage.getItem("token"); // from login
        const res = await fetch("https://properties-backend-ok36.onrender.com/api/clicks/admin", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setClicks(data);
      } catch (error) {
        console.error("Error fetching clicks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClicks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Click Analytics</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Value</th>
            <th className="py-2 px-4 border-b">Source Component</th>
            <th className="py-2 px-4 border-b">Total Clicks</th>
          </tr>
        </thead>
        <tbody>
          {clicks.map((click, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">{click._id.type}</td>
              <td className="py-2 px-4 border-b">{click._id.value}</td>
              <td className="py-2 px-4 border-b">{click._id.sourceComponent}</td>
              <td className="py-2 px-4 border-b font-bold">{click.totalClicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminClicks;
