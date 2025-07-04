import { useContext, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";
import PropTypes from "prop-types";

// Component FoodDisplay để hiển thị danh sách các món ăn
const FoodDisplay = ({ category }) => {
  // Sử dụng useContext để lấy danh sách món ăn từ StoreContext
  const { food_list, loading, error, fetchFoodList } = useContext(StoreContext);

  // Fetch data khi category thay đổi
  useEffect(() => {
    fetchFoodList(category);
  }, [category, fetchFoodList]);

  // Loading component
  const LoadingSkeleton = () => (
    <div className="food-display-list">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="food-item-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="error-message">
      <p>😔 {error || "Có lỗi xảy ra khi tải dữ liệu"}</p>
      <button onClick={() => fetchFoodList(category)} className="retry-btn">
        Thử lại
      </button>
    </div>
  );

  // Filter food items based on category
  const filteredFoodList = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  return (
    <div className="food-display" id="food-display">
      

      {loading && <LoadingSkeleton />}

      {error && !loading && <ErrorMessage />}

      {!loading && !error && (
        <div className="food-display-list">
          {filteredFoodList.length > 0 ? (
            filteredFoodList.map((item, index) => (
              <FoodItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                ratings={item.ratings}
              />
            ))
          ) : (
            <div className="no-results">
              <p>Không tìm thấy món ăn nào trong danh mục "{category}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;
