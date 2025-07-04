import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

// Tạo context để chia sẻ trạng thái giữa các component
const StoreContextProvider = (props) => {
  // Khởi tạo state để lưu trữ thông tin giỏ hàng, URL API, token, danh sách món ăn, và tên người dùng
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");

  // Cache cho food list
  const [foodCache, setFoodCache] = useState(new Map());

  // Hàm thêm món vào giỏ hàng
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Hàm xóa món khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Hàm tính tổng số tiền trong giỏ hàng
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Hàm lấy danh sách món ăn từ API với caching
  const fetchFoodList = useCallback(
    async (category = "All", search = "") => {
      try {
        setLoading(true);
        setError(null);

        // Tạo cache key
        const cacheKey = `${category}-${search}`;

        // Kiểm tra cache
        if (foodCache.has(cacheKey)) {
          const cachedData = foodCache.get(cacheKey);
          if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
            // 5 phút cache
            setFoodList(cachedData.data);
            setLoading(false);
            return;
          }
        }

        // Tạo params cho API
        const params = new URLSearchParams({
          limit: "100", // Lấy nhiều items hơn cho frontend
        });

        if (category && category !== "All") {
          params.append("category", category);
        }
        if (search) {
          params.append("search", search);
        }

        const response = await axios.get(`${url}/api/food/list?${params}`);

        if (response.data.success) {
          setFoodList(response.data.data);

          // Lưu vào cache
          setFoodCache(
            (prev) =>
              new Map(
                prev.set(cacheKey, {
                  data: response.data.data,
                  timestamp: Date.now(),
                })
              )
          );
        } else {
          setError("Không thể tải danh sách món ăn");
        }
      } catch (error) {
        console.error("Error fetching food list:", error);
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    },
    [url, foodCache]
  );

  // Hàm lấy categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [url]);

  // Hàm tải dữ liệu giỏ hàng từ API khi có token
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Hàm clear cache
  const clearCache = () => {
    setFoodCache(new Map());
  };

  // useEffect để tải dữ liệu
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchCategories();

      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        setName(localStorage.getItem("name"));
        if (localStorage.getItem("userId")) {
          setUserId(localStorage.getItem("userId"));
        }
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, [fetchFoodList, fetchCategories]);

  // Giá trị của context để truyền xuống các component con
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    name,
    userId,
    setUserId,
    loading,
    error,
    categories,
    fetchFoodList,
    clearCache,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
