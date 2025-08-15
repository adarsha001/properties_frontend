import React, { useEffect, useState } from "react";

const AdminClicks = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const token = localStorage.getItem("token"); // from login
        const res = await fetch(
          "https://properties-backend-ok36.onrender.com/api/admin/click",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Click Analytics
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="py-2 px-3 sm:px-4 border-b text-left">Type</th>
              <th className="py-2 px-3 sm:px-4 border-b text-left">Value</th>
              <th className="py-2 px-3 sm:px-4 border-b text-left">Source</th>
              <th className="py-2 px-3 sm:px-4 border-b text-center">
                Total Clicks
              </th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors text-gray-700"
              >
                <td className="py-2 px-3 sm:px-4 border-b">{click._id.type}</td>
                <td className="py-2 px-3 sm:px-4 border-b break-words">
                  {click._id.value}
                </td>
                <td className="py-2 px-3 sm:px-4 border-b">
                  {click._id.sourceComponent}
                </td>
                <td className="py-2 px-3 sm:px-4 border-b font-bold text-center">
                  {click.totalClicks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClicks;
