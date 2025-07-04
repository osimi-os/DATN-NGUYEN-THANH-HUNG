import { useContext, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Rating.css";
import { StoreContext } from "../../context/StoreContext";

// Trang Rating để người dùng đánh giá các sản phẩm trong đơn hàng của mình
const Rating = () => {
  const { url, token, name, userId } = useContext(StoreContext);
  // Lấy state từ địa chỉ hiện tại (dùng để chứa thông tin đơn hàng từ trang trước)
  const { state } = useLocation();
  // Lưu trữ thông tin các món ăn cần đánh giá
  const [items] = useState(state ? state.items : []);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  // State để lưu trữ đánh giá (bình luận và đánh giá)
  const [rating, setRating] = useState({
    comment: "",
    rate: "",
  });
  // State cho hiệu ứng hover preview
  const [hoveredStar, setHoveredStar] = useState(0);

  // Lấy id của đơn hàng từ địa chỉ
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Hàm xử lý khi có sự thay đổi trong ô nhập liệu
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setRating((rating) => ({ ...rating, [name]: value }));
  };

  // Hàm xử lý khi người dùng gửi biểu mẫu đánh giá
  const handleSubmit = async (event) => {
    event.preventDefault();

    const item = items[currentItemIndex];

    let ratingData = {
      comment: rating.comment,
      rating: rating.rate,
      name: name || "Ẩn danh",
      userId: userId || "",
    };

    try {
      const response = await axios.post(
        `${url}/api/order/${orderId}/rate/${item._id}`,
        ratingData,
        { headers: { token } }
      );

      if (response.data.success) {
        if (currentItemIndex < items.length - 1) {
          setCurrentItemIndex(currentItemIndex + 1);
        } else {
          updateOrderRatedStatus();
          navigate("/myorders");
        }
      } else {
        console.error("Error submitting rating");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Hàm cập nhật trạng thái đã đánh giá của đơn hàng
  const updateOrderRatedStatus = async () => {
    try {
      await axios.put(`${url}/api/order/${orderId}`);
    } catch (error) {
      console.error("Error updating rated status:", error);
    }
  };

  // Nếu không có món ăn hoặc không có dữ liệu, hiển thị thông báo "Loading..."
  if (!items || items.length === 0) {
    return <div>Loading...</div>;
  }

  // Lấy thông tin của món ăn hiện tại đang được đánh giá
  const currentItem = items[currentItemIndex];

  // Hàm chọn rating bằng sao
  const handleStarClick = (starValue) => {
    setRating((prev) => ({ ...prev, rate: starValue }));
  };

  return (
    <div className="rating">
      <div className="rating-box">
        <div className="rating-food-info">
          <img
            className="rating-food-image"
            src={
              currentItem.image
                ? url + "/images/" + currentItem.image
                : "https://via.placeholder.com/100x100?text=No+Image"
            }
            alt={currentItem.name}
          />
          <div className="rating-food-meta">
            <h2 className="rating-title">{currentItem.name}</h2>
            <p className="rating-food-price">
              {currentItem.price?.toLocaleString("vi-VN")}{" "}
              <span className="vnd">₫</span>
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="rating-group">
            <label>Comment:</label>
            <input
              required
              name="comment"
              onChange={onChangeHandler}
              value={rating.comment}
              type="text"
              placeholder="comment"
            />
          </div>
          <div className="rating-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    "star" +
                    ((hoveredStar || Number(rating.rate)) >= star
                      ? " selected"
                      : "") +
                    (hoveredStar >= star ? " preview" : "")
                  }
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Rate ${star} star`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleStarClick(star);
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Rating;
