import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../../../css/Login/LoginForm.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isToothHovered, setIsToothHovered] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const response = await axios.get('http://127.0.0.1:8000/api/protected-route', {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
      console.log('res', res);
      console.log(response);
      navigate('/calendar');
    } catch (error) {
      console.log('error', error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div id='login_global' className="dental-bg">
      <motion.div
        className="dental-login-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Tooth Icon Header */}
        <motion.div 
          className="tooth-header"
          animate={{ 
            rotate: isToothHovered ? [0, 10, -10, 0] : 0,
            y: isToothHovered ? [0, -5, 5, 0] : 0
          }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsToothHovered(true)}
          onHoverEnd={() => setIsToothHovered(false)}
        >
          <img src="Images/Logo/NewSmile_colored.png" className="tooth-icon" alt="" />
          <motion.h1
            className="dental-login-title"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            New Smile Clinic
          </motion.h1>
        </motion.div>

        <motion.form
          className="dental-login-form"
          onSubmit={login}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="input-group">
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="dental-input"
              whileFocus={{ 
                scale: 1.05,
                boxShadow: "0 0 0 2px rgba(100, 200, 255, 0.3)"
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>

          <div className="input-group">
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="dental-input"
              whileFocus={{ 
                scale: 1.05,
                boxShadow: "0 0 0 2px rgba(100, 200, 255, 0.3)"
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M12 1C8.14 1 5 4.14 5 8c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-3.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2 11h-4v3h4v-3zm-4-7v2h4V5h-4z"/>
            </svg>
          </div>

          <motion.button
            type="submit"
            className="dental-button"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#da2b04"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span>Login</span>
            <svg className="button-icon" viewBox="0 0 24 24">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
          </motion.button>
        </motion.form>

        <motion.div 
          className="dental-decoration"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Dental tools decorative elements */}
          <svg className="dental-tool mirror" viewBox="0 0 24 24">
            <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm0-11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <svg className="dental-tool probe" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
          </svg>
        </motion.div>
      </motion.div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backgroundColor: '#f8f9fa',
          color: '#264653'
        }}
      />
    </div>
  );
};

export default LoginForm;