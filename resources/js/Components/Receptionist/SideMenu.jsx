import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";  // Import NavLink
import '../../../css/Receptionist/sidemenu.css';
import { MdDashboard } from "react-icons/md";
import {
  Home,
  Calendar,
  Users,
  Smile,
  Receipt,
  LogOut,
  Menu,
} from "lucide-react";
import { MdPayments } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";

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
    { icon: <Home size={20} />, label: "Calendar", path: "/calendar" },
    { icon: <Calendar size={20} />, label: "Appointments", path: "/appointments" },
    { icon: <Users size={20} />, label: "Patients", path: "/patients" },
    { icon: <MdPayments size={20} />, label: "Invoices", path: "/factures" },
    { icon: <Receipt size={20} />, label: "Facturisation", path: "/facturisation" },
    { icon: <BsFillChatDotsFill size={20} />, label: "Messages", path: "/messages" },
    { icon: <MdDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <IoPersonSharp size={20} />, label: "Profile", path: "/profile" },
    { icon: <LogOut size={20}  />, label: "Logout", action: HandleLogout }
  ];
  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 80 }}
      className="side-menu"
    >
      <div className="header">
        <span className="logo">
          {isOpen &&
            <img src="Images/Logo/newSmile_white.png" id="logo_white" alt="" />
          }
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
