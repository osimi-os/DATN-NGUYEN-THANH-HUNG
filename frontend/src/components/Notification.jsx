import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import "./Notification.css";

const Notification = () => {
  const { url, userId } = useContext(StoreContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await axios.get(url + "/api/notification/user", {
      params: { userId },
    });
    setNotifications(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [userId]);

  const markAsRead = async (notificationId) => {
    await axios.post(url + "/api/notification/read", {
      notificationId,
      userId,
    });
    fetchNotifications();
  };

  if (selected) {
    const n = selected;
    return (
      <div className="notification-user-page">
        <button
          className="notification-back-btn"
          onClick={() => setSelected(null)}
        >
          &larr; Back
        </button>
        {n.coverImage && (
          <img
            src={url + "/images/" + n.coverImage}
            alt="cover"
            className="notification-detail-img"
          />
        )}
        <h2 className="notification-detail-title">{n.title}</h2>
        <div className="notification-detail-date">
          {new Date(n.createdAt).toLocaleString()}
        </div>
        <div
          className="notification-detail-content"
          dangerouslySetInnerHTML={{ __html: n.content }}
        />
      </div>
    );
  }

  return (
    <div className="notification-user-page">
      <h2 className="notification-title">Notification</h2>
      {loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div>No notifications yet.</div>
      ) : (
        notifications.map((n) => (
          <div
            className={`notification-card${
              n.readBy?.includes(userId) ? "" : " unread"
            }`}
            key={n._id}
            onClick={() => {
              setSelected(n);
              if (!n.readBy?.includes(userId)) markAsRead(n._id);
            }}
          >
            {n.coverImage && (
              <img
                src={url + "/images/" + n.coverImage}
                alt="cover"
                className="notification-card-img"
              />
            )}
            <div className="notification-card-content">
              <div className="notification-card-title">{n.title}</div>
              <div className="notification-card-date">
                {new Date(n.createdAt).toLocaleString()}
              </div>
              <div
                className="notification-card-snippet"
                dangerouslySetInnerHTML={{
                  __html:
                    n.content.slice(0, 120) +
                    (n.content.length > 120 ? "..." : ""),
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
