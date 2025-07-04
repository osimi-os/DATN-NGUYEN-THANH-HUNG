import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

// Đỗ Trang
// Component Footer để hiển thị phần footer của trang web
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img id="logo" src={assets.logo} alt="" />
          <p>
            Yumm! Bakery: Crafting sweet moments since 2024. Discover our
            delightful pastries, cakes, and more. Savor the taste of perfection
            with every bite.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+84966088748</li>
            <li>OSIMI_OS@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copy right 2024 © OSIMI_OS.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
