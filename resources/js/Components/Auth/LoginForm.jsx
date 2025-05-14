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
  const navigate=useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://127.0.0.1:8000/api/login',{ email, password });
        localStorage.setItem('token', res.data.token);
        const response = await axios.get('http://127.0.0.1:8000/api/protected-route', {
            headers: {
            Authorization: `Bearer ${res.data.token}`,
            },
        });
        console.log('res',res);
        console.log(response);
        navigate('/calendar');
    } catch (error) {
      console.log('error',error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div id='login_global'>
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="login-title"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome Back
      </motion.h1>

      <motion.form
        className="login-form"
        onSubmit={login}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="login-input"
          whileFocus={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="login-input"
          whileFocus={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.button
          type="submit"
          className="login-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Login
        </motion.button>
      </motion.form>
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      />
    </div>
  );
};

export default LoginForm;
