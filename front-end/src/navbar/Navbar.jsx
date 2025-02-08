import React, { useEffect, useState } from 'react';
import { NavLink} from 'react-router-dom';
import { FaBars } from "react-icons/fa6";
import './navbar.css';
import axios from 'axios';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/get/user", {
          withCredentials: true, // Ensures cookies are sent with the request
        });
        setUser(response.data); // Assuming the response contains user info in the `data` field
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true }); // Assuming a logout route exists
      setUser(null); // Clear user data
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="navbar-parent">
      <nav className="navbar">
        <h2 className="menu-icon" onClick={toggleSidebar}>
          <FaBars /> money-management
        </h2>
        <div className="navbar-links">
          <NavLink to="/" className="nav-link" activeClassName="active-link">Home</NavLink>
          <NavLink to="/table" className="sidebar-link" activeClassName="active-link">table</NavLink>
          <NavLink to="/main" className="nav-link" activeClassName="active-link">Main</NavLink>
          <NavLink to="/add" className="nav-link" activeClassName="active-link">Add</NavLink>


          <NavLink to="/login" className="sidebar-link" activeClassName="active-link">Login/Sign</NavLink>

        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>{user ? user.name : "username"}</h2>
        <h2 onClick={toggleSidebar}>
          <FaBars /> menu
        </h2>
        <NavLink to="/" className="sidebar-link" activeClassName="active-link">Home</NavLink>
        <NavLink to="/main" className="sidebar-link" activeClassName="active-link">Main</NavLink>
        <NavLink to="/table" className="sidebar-link" activeClassName="active-link">Table</NavLink>
        <NavLink to="/add" className="sidebar-link" activeClassName="active-link">Add</NavLink>

          <NavLink to="/login" className="sidebar-link" activeClassName="active-link">Login/Sign</NavLink>

          <button className='logout'  onClick={handleLogout}>Logout</button>

      </div>
    </div>
  );
}

export default Navbar;
