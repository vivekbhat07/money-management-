import React, { useState } from 'react';
import Axios from 'axios'; // Import Axios for HTTP requests
import './Form.css';
import Navbar from '../../navbar/Navbar';

const Add = () => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: '',
    description: '',
  });

  const [message, setMessage] = useState(''); // To display success or error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!formData.date || !formData.amount || !formData.type || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Replace with your backend API endpoint
      const response = await Axios.post(
        'http://localhost:5000/api/transactions', // Backend endpoint
        formData, // Payload
        { withCredentials: true } // Include credentials (if required)
      );

      if (response.status === 201) {
        setMessage('Transaction added successfully!');
        // Reset the form
        setFormData({
          date: '',
          amount: '',
          type: '',
          description: '',
        });
      } else {
        setMessage('Failed to add transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setMessage('Error: Unable to send data to the server.');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="form-container">
        <h2>Transaction Form</h2>
        {message && <p className="message">{message}</p>} {/* Display success or error messages */}
        <form onSubmit={handleSubmit}>
          {/* Date Input */}
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          {/* Type Selection */}
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="rent">Rent</option>
              <option value="food">Food</option>
              <option value="houseHold">HouseHold</option>
              <option value="cloth">Cloth</option>
              <option value="groceris">Groceries</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
