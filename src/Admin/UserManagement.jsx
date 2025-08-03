import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../api';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const UserManagement = ({ getAuthHeader, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'manager'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
console.log(users)
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API.getAllUsers, getAuthHeader());
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(API.updateUser(editingUser._id), form, getAuthHeader());
      } else {
        await axios.post(API.createUser, form, getAuthHeader());
      }
      setForm({ username: '', password: '', email: '', fullName: '', role: 'manager' });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '',
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    await axios.delete(API.deleteUser(userId), getAuthHeader());
    fetchUsers();
  };

  const calculateTotalMinutes = (history) => {
    if (!Array.isArray(history)) return 0;
    return history.reduce((acc, session) => acc + (session.sessionDuration || 0), 0);
  };

  if (currentUser?.role !== 'admin') {
    return <p className="text-center text-red-500 mt-8">Access Denied. Admins only.</p>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin User Management</h1>

      {/* User Creation Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded shadow-md">
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="p-2 border rounded" required />
          {!editingUser && (
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="p-2 border rounded" required />
          )}
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" required />
          <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded">
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {editingUser ? 'Update User' : 'Create User'}
        </button>
      </form>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Sessions</th>
              <th className="border p-2">Total Worked</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const totalMinutes = calculateTotalMinutes(user.loginHistory);
              return (
                <tr key={user._id} className="text-center">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.fullName}</td>
                  <td className="border p-2 capitalize">{user.role}</td>
                  <td className="border p-2">{user.isActive ? '✅' : '❌'}</td>
                  <td className="border p-2">{user.loginHistory?.length || 0}</td>
                  <td className="border p-2">{`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(user)} className="text-yellow-600">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
