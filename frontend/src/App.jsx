import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Food from "./pages/Food/Food";
import Profile from "./pages/Profile/Profile";
import Search from "./pages/Search/Search";
import Rating from "./pages/Rating/Rating";
import Menu from "./pages/Menu/Menu";
import Notification from "./components/Notification";

const App = () => {
  // ShowLogin để Hiển thị popup đăng nhập
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Kiểm tra xem có token trong localStorage không
    if (!token) {
      setShowLogin(true);
    }
  }, []);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <div className="head">
          <Navbar setShowLogin={setShowLogin} />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/food/:id" element={<Food />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/rating/:orderId" element={<Rating />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
