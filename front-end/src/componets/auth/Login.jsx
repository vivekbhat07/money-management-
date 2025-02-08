import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display error messages
  const navigate = useNavigate(); // To redirect after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(''); // Clear previous error message

    try {
      // Replace with your backend API endpoint
      const response = await Axios.post(
        'http://localhost:5000/api/login',
        { email, password },
        { withCredentials: true } // For sending cookies/session info
      );

      if (response.status === 200) {
        alert('Login Successful');
        navigate('/'); // Redirect to home page
      } else {
        setError('Invalid login credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error if exists */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>
        Don't have an account? <NavLink to="/signin" className="link">Sign-Up</NavLink>
      </p>
    </div>
  );
}

export default Login;
