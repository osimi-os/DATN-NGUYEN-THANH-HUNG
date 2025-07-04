import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Trang PlaceOrder sử dụng để người dùng điền thông tin giao hàng của đơn hàng
const PlaceOrder = () => {
  // Lấy thông tin cần thiết từ Context
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  // Khởi tạo state để lưu trữ thông tin đơn hàng
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Hàm xử lý khi thay đổi giá trị của các trường nhập liệu
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Hàm xử lý khi người dùng đặt hàng
  const placeOrder = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    let orderItems = [];
    // Lặp qua danh sách sản phẩm trong giỏ hàng để tạo đơn hàng
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["Quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20000,
    };
    // Gửi yêu cầu POST đến server để đặt hàng
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("error");
    }
  };

  // Sử dụng hook useNavigate để chuyển hướng
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập và giỏ hàng có sản phẩm không
  useEffect(() => {
    if (!token) {
      navigate("/cart"); // Nếu chưa đăng nhập, chuyển hướng đến trang giỏ hàng
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart"); // Nếu giỏ hàng trống, chuyển hướng đến trang giỏ hàng
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount().toLocaleString("vi-VN")} ₫</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {(getTotalCartAmount() === 0 ? 0 : 20000).toLocaleString(
                  "vi-VN"
                )}{" "}
                ₫
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {(getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 20000
                ).toLocaleString("vi-VN")}{" "}
                ₫
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
