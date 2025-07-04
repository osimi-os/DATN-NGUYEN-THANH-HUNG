import { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";

// Trang MyOrders để hiện các đơn hàng mà người dùng đã mua
const MyOrders = () => {
  // Lấy url và token từ Context
  const { url, token } = useContext(StoreContext);
  // Khởi tạo state 'data' để lưu trữ danh sách đơn hàng
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Hàm gọi API để lấy danh sách đơn hàng từ server
  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  // Gọi hàm fetchOrders khi token thay đổi
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Xử lý sự kiện khi người dùng nhấp vào nút đánh giá
  const handleRatingClick = (orderId, items) => {
    navigate(`/rating/${orderId}`, { state: { items } });
  };

  return (
    <div className="my-orders-new">
      <h2 className="my-orders-title">My Orders</h2>
      <div className="my-orders-list">
        {data.length === 0 && (
          <div className="no-orders">You have no orders yet.</div>
        )}
        {[...data]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((order, index) => {
            let statusClass = "";
            if (order.status === "Delivered") statusClass = "delivered";
            else if (order.status === "Pending") statusClass = "pending";
            else statusClass = "cancelled";
            return (
              <div key={index} className="order-card">
                <div className="order-header">
                  <img
                    src={assets.parcel_icon}
                    alt="parcel"
                    className="order-icon"
                  />
                  <div className={`order-status ${statusClass}`}>
                    {order.status}
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-date">
                    <span className="order-label">Date:</span>
                    <span>
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="order-items">
                    <span className="order-label">Items:</span>
                    <span>
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} x {item.Quantity}
                          {idx < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="order-amount">
                    <span className="order-label">Total:</span>
                    <span className="order-money">
                      {order.amount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="order-count">
                    <span className="order-label">Quantity:</span>
                    <span>{order.items.length}</span>
                  </div>
                </div>
                <div className="order-action">
                  {order.status === "Delivered" &&
                    (order.rated ? (
                      <div className="complete-box">Completed</div>
                    ) : (
                      <button
                        onClick={() =>
                          handleRatingClick(order._id, order.items)
                        }
                        className={order.rated ? "rated" : ""}
                      >
                        Rating
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyOrders;
