import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import "./FreshCarousel.css";
import "../FoodItem/FoodItem.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CARDS_PER_PAGE = 3;
const MAX_CAROUSEL_ITEMS = 10;

function getRandomUniqueItems(arr, n) {
  const result = [];
  const used = new Set();
  while (result.length < n && result.length < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      result.push(arr[idx]);
      used.add(idx);
    }
  }
  return result;
}

function getAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((acc, r) => acc + r.rating, 0);
  return (total / ratings.length).toFixed(1);
}

// Component hiển thị số sao (có nửa sao)
const StarRating = ({ rating, max = 5 }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="#FFC107"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
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
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
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

const FreshCarousel = () => {
  const { food_list } = useContext(StoreContext);
  const [carouselItems, setCarouselItems] = React.useState([]); // 10 món random duy nhất
  const [startIdx, setStartIdx] = React.useState(0); // index bắt đầu của 5 món hiển thị

  // Khởi tạo 10 món random duy nhất khi có dữ liệu
  useEffect(() => {
    if (food_list.length > 0 && carouselItems.length === 0) {
      setCarouselItems(getRandomUniqueItems(food_list, MAX_CAROUSEL_ITEMS));
      setStartIdx(0);
    }
    // eslint-disable-next-line
  }, [food_list]);

  // Xử lý next/prev (quay vòng)
  const handleNext = () => {
    if (carouselItems.length <= CARDS_PER_PAGE) return;
    setStartIdx((prev) => (prev + 1) % carouselItems.length);
  };
  const handlePrev = () => {
    if (carouselItems.length <= CARDS_PER_PAGE) return;
    setStartIdx(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  // Render card component
  const CarouselCard = React.memo(function CarouselCard({ item, className }) {
    const webpSrc = item?.image
      ? `http://localhost:4000/images/${item.image.replace(
          /\.(jpg|jpeg|png)$/i,
          ".webp"
        )}`
      : "";
    const origSrc = item?.image
      ? `http://localhost:4000/images/${item.image}`
      : "";
    return (
      <div
        className={`food-item fresh-carousel-food-item carousel-anim ${
          className || ""
        }`}
      >
        <div className="food-item-img-container">
          <Link to={`/food/${item?._id}`}>
            <img
              className="food-item-image"
              src={webpSrc}
              alt={item?.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = origSrc;
              }}
            />
          </Link>
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <Link to={`/food/${item?._id}`}>{item?.name}</Link>
          </div>
          <StarRating rating={parseFloat(getAverageRating(item?.ratings))} />
          <p className="food-item-price">
            {item?.price?.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </div>
    );
  });

  CarouselCard.propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      name: PropTypes.string,
      ratings: PropTypes.array,
      price: PropTypes.number,
    }).isRequired,
    className: PropTypes.string,
  };

  return (
    <div className="fresh-carousel-section">
      <h2 className="fresh-carousel-title">🥐 Freshly Baked</h2>
      <div className="fresh-carousel-list carousel-absolute">
        <button
          className="carousel-btn prev"
          onClick={handlePrev}
          disabled={carouselItems.length <= CARDS_PER_PAGE}
        >
          &lt;
        </button>
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              width: `${(carouselItems.length * 100) / CARDS_PER_PAGE}%`,
              transform: `translateX(-${
                (startIdx * 100) / carouselItems.length
              }%)`,
              transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {carouselItems.map((item) => (
              <CarouselCard key={item?._id} item={item} />
            ))}
          </div>
        </div>
        <button
          className="carousel-btn next"
          onClick={handleNext}
          disabled={carouselItems.length <= CARDS_PER_PAGE}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FreshCarousel;
