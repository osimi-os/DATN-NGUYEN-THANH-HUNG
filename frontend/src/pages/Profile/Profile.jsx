import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

// Trang Profile để hiện thị các thông tin người dùng và tính năng thay đổi thông tin người dùng
const Profile = () => {
  const { url, token } = useContext(StoreContext);
  // Khởi tạo state để lưu trữ dữ liệu người dùng
  const [data, setData] = useState({});
  // Khởi tạo state để lưu trữ dữ liệu biểu mẫu người dùng nhập vào
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    sex: "",
    birthday: "",
    phone: "",
    address: "",
  });

  // State để xác định xem trường email có đang được chỉnh sửa hay không
  const [editEmail, setEditEmail] = useState(false);
  // State để xác định xem trường tên có đang được chỉnh sửa hay không
  const [editName, setEditName] = useState(false);
  // State để xác định xem người dùng đang xem trang cập nhật thông tin hay trang thông tin cá nhân của mình
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  // Hàm lấy thông tin người dùng từ server
  const getUserData = async (token) => {
    const response = await axios.get(url + `/api/user/get`, {
      headers: { token },
    });
    if (response.data.success) {
      setData(response.data.data);
      setFormData(response.data.data); // Update formData with fetched data
    } else {
      console.log("Error");
    }
  };

  // Gọi hàm lấy thông tin người dùng khi token thay đổi
  useEffect(() => {
    getUserData(token);
  }, [token]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      email: data.email,
      name: data.name,
    }));
  }, [data, editEmail, editName]);

  // Hàm xử lý khi có sự thay đổi trên các trường nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xử lý khi người dùng gửi biểu mẫu cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/change`, formData, {
        headers: { token },
      });
      console.log(response.data);
      alert("Successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Hàm chuyển đổi trạng thái chỉnh sửa trường email
  const toggleChangeEmail = () => {
    setEditEmail((prevState) => !prevState);
  };

  // Hàm chuyển đổi trạng thái chỉnh sửa trường tên
  const toggleChangeName = () => {
    setEditName((prevState) => !prevState);
  };

  // Hàm hiển thị trang cập nhật thông tin
  const handleShowUpdateProfile = () => {
    setShowUpdateProfile(true);
  };

  // Hàm hiển thị trang thông tin cá nhân
  const handleShowMyProfile = () => {
    setShowUpdateProfile(false);
  };

  return (
    <div className="profile-new">
      <div className="profile-card">
        <h2 className="title-profile">Manage your profile information</h2>
        <div className="profile-content">
          <div className="sidebar">
            <button
              className={!showUpdateProfile ? "active" : ""}
              onClick={handleShowMyProfile}
            >
              My Profile
            </button>
            <button
              className={showUpdateProfile ? "active" : ""}
              onClick={handleShowUpdateProfile}
            >
              Update
            </button>
          </div>
          <div className="profile-main">
            {showUpdateProfile ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  {editEmail ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>{data.email}</span>
                  )}
                  <button
                    className="change"
                    type="button"
                    onClick={toggleChangeEmail}
                  >
                    Change
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  {editName ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <span>{data.name}</span>
                  )}
                  <button
                    className="change"
                    type="button"
                    onClick={toggleChangeName}
                  >
                    Change
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor="sex">Gender:</label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="Another">Another</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="birthday">Birthday:</label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="save" type="submit">
                  Save
                </button>
              </form>
            ) : (
              <div className="information">
                <div className="item">
                  <label>Email:</label>
                  <p>{data.email || "None"}</p>
                </div>
                <div className="item">
                  <label>Name:</label>
                  <p>{data.name || "None"}</p>
                </div>
                <div className="item">
                  <label>Gender:</label>
                  <p>{data.sex || "None"}</p>
                </div>
                <div className="item">
                  <label>Birthday:</label>
                  <p>
                    {data.birthday
                      ? new Date(data.birthday).toLocaleDateString("en-GB")
                      : "None"}
                  </p>
                </div>
                <div className="item">
                  <label>Phone:</label>
                  <p>{data.phone || "None"}</p>
                </div>
                <div className="item">
                  <label>Address:</label>
                  <p>{data.address || "None"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
