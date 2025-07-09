import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../pages/axiosInstance';
import './Login.css'
import { motion, AnimatePresence } from 'framer-motion';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import type { Engine, ISourceOptions } from 'tsparticles-engine';
import api from './api';

interface LoginProps {
  setUser: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [UserName, setUsername] = useState('');
  const [FullName, setFullName] = useState('');
  const [Phone, setPhone] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearFields = () => {
    setUsername('');
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
  };

  const handleLoginOrRegister = async () => {
    if (!UserName || !Password || (isRegister && (!FullName || !Phone || !Email))) {
      setError('❌ Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { UserName, FullName, Phone, Email, Password }
        : { UserName, Password };

      const { data } = await axios.post(endpoint, payload);
      console.log("✅ Success", data.token);
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('UserName', data.UserName);
        setUser(data.token);
        navigate('/dashboard');
      } else {
        setError('❌ Operation failed. Please try again.');
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('❌ Invalid credentials.');
      } else {
        setError('❌ Server error. Try again later.');
      }
    } finally {
      setLoading(false);
      clearFields();
    }
  };

  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const particlesOptions: ISourceOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    // background: { color: { value: "#000000" } },
    fpsLimit: 60,
    particles: {
      number: { value: 60, density: { enable: true, area: 800 } },
      // color: { value: "#00ffff" },
      links: {
        enable: true,
        color: "#00ffff",
        distance: 120,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        outModes: { default: "bounce" },
      },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 },
      },
    },
    detectRetina: true,
  };

  return (
    <>
      <Particles init={particlesInit} options={particlesOptions} />

      <div className="side-glow left"></div>
      <div className="side-glow right"></div>

      <motion.div
        className="side-glow left-glow"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.div
        className="side-glow right-glow"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.div
        className="login-container upgraded"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="login-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <span className="glow">MentVoxLogin</span>
        </motion.h1>

        <motion.div
          className="auth-buttons"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={`auth-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => setIsRegister(false)}
            whileHover={{ scale: 1.1 }}
          >
            Login
          </motion.button>
          <motion.button
            className={`auth-btn ${isRegister ? 'active' : ''}`}
            onClick={() => setIsRegister(true)}
            whileHover={{ scale: 1.1 }}
          >
            Register
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isRegister && (
            <>
              <motion.div
                className="input-group"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={FullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="login-input"
                />
              </motion.div>
              <motion.div
                className="input-group"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <input
                  type="text"
                  placeholder="Phone"
                  value={Phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="login-input"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={UserName}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input password-input"
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoginOrRegister}
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
        </motion.button>
      </motion.div>
    </>
  );
};

export default Login;
