import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

// Thanh bên cho trang Admin
const Sidebar = ({ visible, onClose }) => {
  return (
    <div className={`sidebar${visible ? " sidebar-mobile-visible" : ""}`}>
      <button
        className="sidebar-close-btn"
        onClick={onClose}
        aria-label="Đóng sidebar"
      >
        &times;
      </button>
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/Report" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Report</p>
        </NavLink>
        <NavLink to="/notification" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Notification</p>
        </NavLink>
      </div>
    </div>
  );
};
export default Sidebar;
