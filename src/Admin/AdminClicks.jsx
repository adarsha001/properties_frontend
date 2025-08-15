import React, { useEffect, useState } from "react";

const AdminClicks = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://properties-backend-ok36.onrender.com/api/admin/click", {
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

  if (loading) return <div className="p-6 text-center"><p>Loading...</p></div>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Click Analytics</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left">Type</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Value</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Source</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {clicks.length > 0 ? (
              clicks.map((click, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-2 md:px-4 border-b text-sm md:text-base">{click._id.type}</td>
                  <td className="py-2 px-2 md:px-4 border-b text-sm md:text-base truncate max-w-xs">{click._id.value}</td>
                  <td className="py-2 px-2 md:px-4 border-b text-sm md:text-base">{click._id.sourceComponent}</td>
                  <td className="py-2 px-2 md:px-4 border-b font-bold text-sm md:text-base">{click.totalClicks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No click data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClicks;