import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, ResponsiveContainer
} from 'recharts';

import {
  People, LocalHospital, Science, EventAvailable, RequestQuote, Receipt, MonetizationOn
} from '@mui/icons-material';
import { FaUserMd, FaUserNurse, FaTooth, FaCalendarAlt, FaFileInvoice, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';
import '../../../css/Receptionist/Dashboard.css';
import SideMenu from './SideMenu';
import { TbNurseFilled } from "react-icons/tb";
const statIcons = {
    'Patients': <FaUserMd color="#007bff" />,
    'Dentists': <FaTooth color="#28a745" />,
    'Assistants': <FaUserNurse color="#fd7e14" />,
    'Appointments This Month': <FaCalendarAlt color="#dc3545" />,
    'Estimates': <FaFileAlt color="#6f42c1" />,
    'Invoices': <FaFileInvoice color="#20c997" />,
    'Total Revenue': <FaMoneyBillWave color="#ffc107" />,
  };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (section) => {
      setExpandedSection(prev => prev === section ? null : section);
  };

  useEffect(() => {
    axios.get('/api/dashboard-stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setStats(response.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div>Loading...</div>;

  const statList = [
    { label: 'Patients', value: stats.patients, expandable: 'patients' },
    { label: 'Dentists', value: stats.dentists, expandable: 'dentists' },
    { label: 'Assistants', value: stats.nurses, expandable: 'nurses' },
    { label: 'Appointments This Month', value: stats.appointments_this_month },
    { label: 'Estimates', value: stats.estimates },
    { label: 'Invoices', value: stats.invoices },
    { label: 'Total Revenue', value: `$${stats.revenue}` },
  ];
console.log(stats);
  return (
    <div className="dashboard-container">
      <SideMenu />
      <div className="dashboard-content">
        {/* <h2 className="dashboard-title">👋 Welcome back! Here's your summary</h2> */}

        {/* Horizontally scrollable stat cards */}
        <div className="stat-grid">
            {statList.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                onClick={() => stat.expandable && toggleSection(stat.expandable)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ cursor: stat.expandable ? 'pointer' : 'default' }}
              >
                <div className="icon">{statIcons[stat.label]}</div>
                <div>
                  <h4>{stat.label}</h4>
                  <p>{stat.value}</p>
                </div>
              </motion.div>
            ))}
        </div>
        {expandedSection === 'dentists' && (
        <motion.div className="detail-cards-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="section-header">
            <h3>Dentists</h3>
            <button className="close-btn" onClick={() => setExpandedSection(null)}>✖</button>
            </div>
            <div className="detail-cards">
            {stats.dentists_list.map(d => (
                <div key={d.id} className="person-card">
                <h4>{d.user.firstname}</h4>
                <p>{d.user.tel}</p>
                </div>
            ))}
            </div>
        </motion.div>
        )}
        {expandedSection === 'nurses' && (
        <motion.div className="detail-cards-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="section-header">
              <h3>Assistants</h3>
              <button className="close-btn" onClick={() => setExpandedSection(null)}>✖</button>
            </div>
            <div>
              <div><motion.button className="add-btn"
            onClick={() =>navigate('/patients/addpatient')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}> <TbNurseFilled size={20}/> </motion.button></div>
              <div className="detail-cards">
              {stats.nurses_list.map(n => (
                  <div key={n.id} className="person-card">
                  <h4>{n.user.firstname} {n.user.lastname}</h4>
                  <p>{n.user.tel}</p>
                  </div>
              ))}
              </div>
            </div>
        </motion.div>
        )}

        {expandedSection === 'patients' && (
        <motion.div className="detail-cards-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="section-header">
            <h3>Patients</h3>
            <button className="close-btn" onClick={() => setExpandedSection(null)}>✖</button>
            </div>
            <div className="detail-cards">
            {stats.patients_list.map(p => (
                <div key={p.id} className="person-card">
                <h4>{p.user.firstname} {p.user.lastname}</h4>
                <p>{p.user.tel}</p>
                </div>
            ))}
            </div>
        </motion.div>
        )}
        {/* Charts */}
        <div className="charts-section">
          <motion.div className="chart-box" whileHover={{ scale: 1.02 }}>
            <h3>📅 Appointments Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.appointments_chart}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#bd2503" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="chart-box" whileHover={{ scale: 1.02 }}>
            <h3>💰 Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenue_chart}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0404da" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
