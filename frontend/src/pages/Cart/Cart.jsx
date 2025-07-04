import { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

// Page cart để hiện thị danh sách các món ăn trong giỏ hàng
const Cart = () => {
  // Sử dụng context để lấy các thông tin và hàm cần thiết
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  // Sử dụng useNavigate để điều hướng
  const navigate = useNavigate();

  const [promo, setPromo] = useState("");
  const discountRate = 0.2;
  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 20000;
  const subtotal = getTotalCartAmount();
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="cart-page-flex">
      <div className="cart-items-list">
        <div className="cart-items-cards">
          {food_list
            .filter((item) => cartItems[item._id] > 0)
            .map((item) => (
              <div className="cart-item-card" key={item._id}>
                <img
                  className="cart-item-img-lg"
                  src={url + "/images/" + item.image}
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    {item.price.toLocaleString("vi-VN")} VND
                  </div>
                </div>
                <div className="cart-item-qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    -
                  </button>
                  <span className="cart-item-qty">{cartItems[item._id]}</span>
                  <button
                    className="qty-btn"
                    onClick={() => addToCart(item._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="cart-item-remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="cart-summary-box">
        <h2 className="cart-summary-title">Order Summary</h2>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString("vi-VN")} VND</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery Fee</span>
          <span>{deliveryFee.toLocaleString("vi-VN")} VND</span>
        </div>
        <hr />
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>{total.toLocaleString("vi-VN")} VND</span>
        </div>
        <div className="cart-summary-promo">
          <input
            type="text"
            placeholder="Add promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="cart-summary-promo-input"
          />
          <button className="cart-summary-promo-btn">Apply</button>
        </div>
        <button
          className="cart-summary-checkout-btn"
          onClick={() => navigate("/order")}
        >
          Go to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;
