import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // Lấy danh sách đơn hàng từ backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(url + "/api/order/list");
      if (res.data.success) {
        // Sắp xếp đơn hàng theo ngày mới nhất
        const sorted = [...res.data.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sorted);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    (order.address.firstName + " " + order.address.lastName)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="order-container">
      <h2>Order List</h2>
      <input
        className="order-search"
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="order-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Id</th>
            <th>Status</th>
            <th>Revenue</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id} className="order-line">
              <td>
                <div className="customer-info">
                  <div className="customer-name">
                    {order.address.firstName} {order.address.lastName}
                  </div>
                  <div className="customer-email">{order.address.email}</div>
                </div>
              </td>
              <td>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.Quantity}
                    {idx !== order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </td>
              <td>#{order._id.slice(-5)}</td>
              <td>
                <select
                  className={`status-select ${order.status
                    .replace(/\s/g, "-")
                    .toLowerCase()}`}
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                >
                  <option value="Food processing">Food processing</option>
                  <option value="Out of delivery">Out of delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td>{order.amount.toLocaleString()}₫</td>
              <td>
                {new Date(order.date || order.createdAt).toLocaleDateString(
                  "en-GB"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
