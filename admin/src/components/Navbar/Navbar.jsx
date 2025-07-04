import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

// Thanh điều hướng của trang admin
const Navbar = ({ toggleSidebar }) => {
  //  render giao diện cho thanh điều hướng
  return (
    <div className="navbar">
      <button
        className="navbar-menu-btn"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        <span className="navbar-menu-icon">&#9776;</span>
      </button>
      <img src={logo} alt="Logo" className="logo" />
      
    </div>
  );
};

export default Navbar;
