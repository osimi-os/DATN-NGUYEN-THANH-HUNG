import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
import PropTypes from "prop-types";

// Đỗ Trang, Thu Thảo
// Component LoginPopup để hiển thị cửa sổ popup đăng nhập và đăng ký
const LoginPopup = ({ setShowLogin }) => {
  // Sử dụng useContext để lấy url và setToken từ context
  const { url, setToken, setUserId } = useContext(StoreContext);

  // State để lưu trạng thái hiện tại của form (đăng nhập hoặc đăng ký)
  const [currState, setCurrState] = useState("Login");

  // State để lưu thông tin người dùng nhập vào form
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Hàm xử lý sự kiện khi người dùng thay đổi giá trị trong input
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Hàm xử lý sự kiện khi người dùng đăng nhập hoặc đăng ký
  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      // Lưu userId nếu có
      const userId = response.data.user?._id || response.data._id;
      if (userId) {
        localStorage.setItem("userId", userId);
        if (setUserId) setUserId(userId);
      }
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {/* Hiển thị input cho tên người dùng khi ở trạng thái "Đăng ký" */}
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Log in"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuning, i agree to terms of use & privacy policy</p>
        </div>
        {/* Link để chuyển đổi giữa đăng nhập và đăng ký */}
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup;
