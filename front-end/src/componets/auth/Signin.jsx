import React, { useState } from 'react';
import './Auth.css';
import { NavLink, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // For redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!email || !password || !confirmPassword || !userName) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        credentials:"include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: userName },
        ), // Ensure `name` matches backend expectations
      });

      const data = await response.json();

      if (data.status === 'ok') {
        setSuccess('Account created successfully!');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUserName('');
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong, please try again later');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <NavLink to="/">Login</NavLink>
      </p>
    </div>
  );
};

export default SignUp;
