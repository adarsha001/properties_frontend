import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [managers, setManagers] = useState([]);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, managersRes, activitiesRes] = await Promise.all([
          axios.get('/api/contact/dashboard/stats'),
          axios.get('/api/admin/users'),
          axios.get('/api/contact/activity/logs')
        ]);
        
        setStats(statsRes.data);
        setManagers(managersRes.data.filter(user => user.role === 'manager'));
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleViewManager = (managerId) => {
    navigate(`/managers/${managerId}`);
  };

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Contacts</h3>
          <p>{stats.totalContacts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Managers</h3>
          <p>{stats.totalManagers}</p>
        </div>
      </div>

      <h2>Manager Activity</h2>
      <div className="managers-list">
        {managers.map(manager => (
          <div key={manager._id} className="manager-card" onClick={() => handleViewManager(manager._id)}>
            <h3>{manager.username}</h3>
            <p>Last activity: {manager.lastActivity || 'Never'}</p>
          </div>
        ))}
      </div>

      <h2>Recent Activities</h2>
      <div className="activities-list">
        {activities.slice(0, 10).map(activity => (
          <div key={activity._id} className="activity-item">
            <p>
              <strong>{activity.username}</strong> ({activity.role}) - {activity.action}
            </p>
            <small>{new Date(activity.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;