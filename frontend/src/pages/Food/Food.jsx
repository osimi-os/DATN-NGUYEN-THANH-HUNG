import { useContext, useEffect, useState } from "react";
import "./Food.css";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import FoodItem from "../../components/FoodItem/FoodItem";

// Trang Food để hiện thị thông tin chi tiết của món ăn
const Food = () => {
  const { id } = useParams();
  const { cartItems, addToCart, removeFromCart, url, name } =
    useContext(StoreContext);
  const [data, setData] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [fullItem, setFullItem] = useState([]);

  // Fetch thông tin món ăn từ API
  const fetchFood = async () => {
    const response = await axios.get(url + `/api/food/${id}`);
    if (response.data.success) {
      setData(response.data.data);
      calAverageRating(response.data.data.ratings);
      fetchRecommendations(response.data.data.name, name);
    } else {
      console.log("Error");
    }
  };

  // Fetch đề xuất món ăn từ API
  const fetchRecommendations = async (itemName, userName) => {
    if (!itemName) return;
    try {
      const response = await axios.get(`${url}/api/food/recommend`, {
        params: {
          item_name: itemName,
          user_name: userName,
        },
      });
      if (response.data.success) {
        if (response.data.recommendations.length > 0) {
          // Đảm bảo truyền mảng tên (string) vào fetchItem
          const nameList = response.data.recommendations.map((item) =>
            typeof item === "string" ? item : item.name
          );
          fetchItem(nameList);
        } else {
          await fetchFallbackRecommendations(itemName);
        }
      } else {
        await fetchFallbackRecommendations(itemName);
      }
    } catch (error) {
      await fetchFallbackRecommendations(itemName);
    }
  };

  // Fetch thông tin các món ăn đề xuất từ API
  const fetchItem = async (list) => {
    const item = [];
    for (let i = 0; i < list.length; i++) {
      const response = await axios.get(url + `/api/food/name?name=${list[i]}`);
      if (response.status === 200) {
        item.push(response.data.data);
      }
    }
    setFullItem(item);
  };

  // Fallback function để lấy recommendations cùng category
  const fetchFallbackRecommendations = async (itemName) => {
    try {
      if (!data.category) return;
      const fallbackResponse = await axios.get(
        `${url}/api/food/list?category=${data.category}&limit=10`
      );
      if (fallbackResponse.data.success) {
        const fallbackItems = fallbackResponse.data.data
          .filter((item) => item.name !== itemName)
          .slice(0, 6);
        setFullItem(fallbackItems);
      }
    } catch (fallbackError) {
      // silent
    }
  };

  useEffect(() => {
    fetchFood();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id]);

  // Tính điểm đánh giá trung bình
  const calAverageRating = (ratings) => {
    if (ratings && ratings.length > 0) {
      const totalRating = ratings.reduce(
        (acc, rating) => acc + parseInt(rating.rating),
        0
      );
      const avgRating = (totalRating / ratings.length).toFixed(1);
      setAverageRating(avgRating);
    } else {
      setAverageRating(0);
    }
  };

  // Hiển thị đánh giá bằng sao
  const renderStarRating = (value) => {
    const stars = [];
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;
    for (let i = 1; i <= integerPart; i++) {
      stars.push(
        <span key={i} className="star filled">
          &#9733;
        </span>
      );
    }
    if (decimalPart > 0 && decimalPart < 1) {
      stars.push(
        <span key="half-star" className="star half-filled">
          &#9733;
        </span>
      );
    }
    for (let i = stars.length + 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star">
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="food food-flex">
      <div className="food-main">
        <div className="food-img-col">
          <img
            className="food-item-img"
            src={url + "/images/" + data.image}
            alt={data.name}
          />
        </div>
        <div className="food-info-col">
          <h1 className="food-title">{data.name}</h1>
          <p className="food-price">{data.price} VND</p>
          <p className="food-category">
            <b>Category:</b> {data.category}
          </p>
          <p className="food-description-title">Description:</p>
          <p className="food-description">{data.description}</p>
          <div className="food-rating-summary">
            <span className="food-rating-value">{averageRating}</span>
            <span className="food-rating-stars">
              {renderStarRating(Number(averageRating))}
            </span>
            <span className="food-rating-count">
              ({data.ratings ? data.ratings.length : 0} ratings)
            </span>
          </div>
          {!cartItems[data._id] ? (
            <button className="add-button" onClick={() => addToCart(data._id)}>
              Add to cart
            </button>
          ) : (
            <div className="food-item-counters">
              <img
                onClick={() => removeFromCart(data._id)}
                src={assets.remove_icon_red}
                alt="remove"
              />
              <p>{cartItems[data._id]}</p>
              <img
                onClick={() => addToCart(data._id)}
                src={assets.add_icon_green}
                alt="add"
              />
            </div>
          )}
        </div>
      </div>

      <div className="box-rating">
        <h2 className="rating-title">Ratings</h2>
        <div className="comment-container">
          {data.ratings && data.ratings.length > 0 ? (
            <ul className="rating-list">
              {data.ratings.map((rating, index) => (
                <li key={index} className="rating-item">
                  <div className="rating-header">
                    <span className="rating-user">
                      <b>{rating.name || "Ẩn danh"}</b>
                    </span>
                    <span className="rating-stars">
                      {renderStarRating(Number(rating.rating))}
                    </span>
                  </div>
                  <p className="rating-comment">{rating.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ratings</p>
          )}
        </div>
      </div>

      <div className="recommend-item">
        <h2>Recommend food for you</h2>
        <hr />
        <div className="recommend-list">
          {fullItem.length > 0 ? (
            fullItem.map((food) => (
              <FoodItem
                key={food._id}
                id={food._id}
                name={food.name}
                price={food.price}
                description={food.description}
                image={food.image}
              />
            ))
          ) : (
            <p>No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Food;
