import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/adminStyles';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.get(
      `http://localhost:3001/Admin?email=${formData.email}`
    );

    if (res.data.length === 0) {
      alert("Invalid Email");
      return;
    }

    if (res.data[0].password !== formData.password) {
      alert("Wrong Password");
      return;
    }

    sessionStorage.setItem("s_aid", res.data[0].id);
    sessionStorage.setItem("s_aname", res.data[0].name);

    onLogin(res.data[0].name);
    navigate("/alogin");
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <h1 style={styles.loginLogo}>Shoppers</h1>
          <p style={styles.loginSubtitle}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginButton}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;