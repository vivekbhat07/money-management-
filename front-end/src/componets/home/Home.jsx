import React from "react";
import "./home.css";
import { NavLink } from 'react-router-dom';
import Navbar from "../../navbar/Navbar";

const Home = () => {
  return (
    <div className="home"><Navbar/>
      <header className="header">
        <h1 className="app-name">Expense-tracker</h1>
        <p className="tagline">Track, Save, and Grow Your Wealth</p>
      </header>
      <div className="features">
        <div className="feature-card slide-in">
          <h3>Track Expenses</h3>
          <p>Stay on top of your spending habits with detailed analytics.</p>
        </div>
        <div className="feature-card slide-in">
          <h3>Set Goals</h3>
          <p>Define savings goals and get personalized tips to achieve them.</p>
        </div>
        <div className="feature-card slide-in">
          <h3>Budget Smartly</h3>
          <p>Plan your budget effectively to make the most of your income.</p>
        </div>
      </div>
      <footer className="footer">
        <button className="cta-button bounce"><NavLink className="navlink" to="/login">Get Started</NavLink></button>
      </footer>
    </div>
  );
};

export default Home;
