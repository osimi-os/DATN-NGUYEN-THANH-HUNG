import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Report from "./pages/Report/Report";
import Notification from "./pages/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const url = "http://localhost:4000";
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div>
      <ToastContainer />
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="app-layout">
        {/* Overlay che nền khi sidebar mở trên mobile */}
        {sidebarVisible && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setSidebarVisible(false)}
          ></div>
        )}
        <Sidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />
        <div className="app-content">
          <Routes>
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/report" element={<Report url={url} />} />
            <Route path="/notification" element={<Notification url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
