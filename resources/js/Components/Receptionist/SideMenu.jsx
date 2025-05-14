import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";  // Import NavLink
import '../../../css/Receptionist/sidemenu.css';
import {
  Home,
  Calendar,
  Users,
  Smile,
  Receipt,
  LogOut,
  Menu,
} from "lucide-react";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const HandleLogout = async () => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      localStorage.removeItem('token');

      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/calendar" },
    { icon: <Calendar size={20} />, label: "Appointments", path: "/appointments" },
    { icon: <Users size={20} />, label: "Patients", path: "/patients" },
    { icon: <Smile size={20} />, label: "Factures", path: "/factures" },
    { icon: <Receipt size={20} />, label: "Facturisation", path: "/facturisation" },
    { icon: <LogOut size={20}  />, label: "Logout", action: HandleLogout },
  ];
  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 80 }}
      className="side-menu"
    >
      <div className="header">
        <span className="logo">
          {isOpen && "New Smile"}
        </span>
        <Menu
          className="menu-icon"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            {item.path ? (
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'active-link menu-link' : 'menu-link')}
              >
                {item.icon}
                {isOpen && <span className="menu-label">{item.label}</span>}
              </NavLink>
            ) : (
              <div className="menu-link" onClick={item.action}>
                {item.icon}
                {isOpen && <span className="menu-label">{item.label}</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
