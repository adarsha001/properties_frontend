import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./api"; // Adjust the path as needed

const AdminLogin = () => {
  const [password, setPassword] = useState("garudan@123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API.adminLogin, { password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch {
      alert("Invalid password");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto mt-20">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
        placeholder="Enter admin password"
      />
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
