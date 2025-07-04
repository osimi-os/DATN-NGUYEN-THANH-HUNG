import { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext.jsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Component FoodItem để hiển thị thông tin của một món ăn
const FoodItem = ({ id, name, price, image, ratings }) => {
  // Sử dụng useContext để lấy các phương thức và trạng thái từ context
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  // Hàm tính điểm trung bình đánh giá của món ăn
  const calculateAverageRating = (ratings) => {
    if (ratings && ratings.length > 0) {
      const totalRating = ratings.reduce(
        (acc, rating) => acc + rating.rating,
        0
      );
      const averageRating = totalRating / ratings.length;
      return averageRating.toFixed(1);
    } else {
      return 0;
    }
  };

  // Gọi hàm để tính điểm trung bình đánh giá
  const averageRating = calculateAverageRating(ratings);

  // Component hiển thị số sao (có nửa sao)
  const StarRating = ({ rating, max }) => {
    const stars = [];
    for (let i = 1; i <= max; i++) {
      if (rating >= i) {
        // full star
        stars.push(
          <svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#FFC107"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        );
      } else if (rating >= i - 0.5) {
        // half star
        stars.push(
          <svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`half_grad_${i}`}>
                {" "}
                <stop offset="50%" stopColor="#FFC107" />{" "}
                <stop offset="50%" stopColor="#E0E0E0" />{" "}
              </linearGradient>
            </defs>
            <path
              d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
              fill={`url(#half_grad_${i})`}
            />
          </svg>
        );
      } else {
        // empty star
        stars.push(
          <svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#E0E0E0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        );
      }
    }
    return <div className="star-rating">{stars}</div>;
  };

  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    max: PropTypes.number,
  };

  StarRating.defaultProps = {
    max: 5,
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        {/* Link đến trang chi tiết món ăn */}
        <Link to={`/food/${id}`}>
          <img
            className="food-item-image"
            src={url + "/images/" + image}
            alt=""
          />
        </Link>
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <Link to={`/food/${id}`}>{name}</Link>
        </div>
        <StarRating rating={parseFloat(averageRating)} />
        <p className="food-item-price">{price.toLocaleString("vi-VN")} ₫</p>
      </div>
    </div>
  );
};
FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string,
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
    })
  ),
};

export default FoodItem;
