import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const emptyForm = {
  title: "",
  content: "",
  type: "promo",
  target: "all",
  coverImage: null,
};

const Notification = ({ url }) => {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await axios.get(url + "/api/notification/all");
    setNotifications(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setForm({ ...form, coverImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleQuillChange = (value) => {
    setForm({ ...form, content: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("type", form.type);
    formData.append("target", form.target);
    if (form.coverImage) formData.append("coverImage", form.coverImage);
    if (editingId) {
      await axios.put(url + "/api/notification/update/" + editingId, formData);
    } else {
      await axios.post(url + "/api/notification/create", formData);
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await axios.delete(url + "/api/notification/" + id);
    fetchNotifications();
  };

  const handleEdit = (n) => {
    setForm({
      title: n.title,
      content: n.content,
      type: n.type,
      target: n.target,
      coverImage: null,
    });
    setEditingId(n._id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="notification-admin-page">
      <h2>Notification Management</h2>
      <button
        style={{
          marginBottom: 20,
          padding: "8px 18px",
          fontWeight: "bold",
          background: "#ffcc33",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={handleAddNew}
      >
        Add New Notification
      </button>
      <hr />
      <h3>Notification List</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul style={{ padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n._id}
              style={{
                marginBottom: 32,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
                listStyle: "none",
                display: "flex",
                alignItems: "flex-start",
                background: "#faf7f2",
              }}
            >
              {n.coverImage && (
                <img
                  src={url + "/images/" + n.coverImage}
                  alt="cover"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{n.title}</h4>
                <div style={{ color: "#888", fontSize: 13 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      n.content.slice(0, 120) +
                      (n.content.length > 120 ? "..." : ""),
                  }}
                  style={{ margin: "8px 0" }}
                />
                <div>
                  Type: {n.type} | Target: {n.target}
                </div>
                <button
                  style={{
                    marginRight: 8,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: "none",
                    background: "#ffcc33",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(n)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: "none",
                    background: "#ff4d4f",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(n._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0008",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleCreateOrUpdate}
            className="notification-form"
            encType="multipart/form-data"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 500,
              maxWidth: 800,
              width: "90vw",
              boxShadow: "0 2px 16px #0002",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0 }}>
              {editingId ? "Edit Notification" : "Add Notification"}
            </h3>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <ReactQuill
              value={form.content}
              onChange={handleQuillChange}
              placeholder="Content (formatting, images supported)"
              style={{ marginBottom: 12, minHeight: 200 }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            >
              <option value="promo">Promotion</option>
              <option value="new_product">New Product</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
            <input
              name="target"
              value={form.target}
              onChange={handleChange}
              placeholder="all or userId"
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              style={{ marginBottom: 12 }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                background: "#ffcc33",
                fontWeight: "bold",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              {editingId ? "Update" : "Create"} Notification
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

Notification.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Notification;
