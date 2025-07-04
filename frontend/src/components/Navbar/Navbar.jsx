import { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios"; // Import axios
import { assets } from "../../assets/assets.js";
import PropTypes from "prop-types";

// Component Navbar để hiển thị thanh tùy chọn
const Navbar = ({ setShowLogin }) => {
  // State để lưu giá trị của ô tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // State để lưu danh sách gợi ý tìm kiếm
  const [suggestions, setSuggestions] = useState([]);
  // State để xác định hiển thị dropdown gợi ý tìm kiếm
  const [showDropdown, setShowDropdown] = useState(false);
  // State để xác định hiển thị mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // State để lưu giá trị search cho mobile
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  // State để lưu danh sách gợi ý tìm kiếm cho mobile
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  // State để xác định hiển thị dropdown gợi ý tìm kiếm cho mobile
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  // Context để lấy thông tin từ StoreContext
  const { url, getTotalCartAmount, token, setToken } = useContext(StoreContext);

  // Hook để điều hướng đến các trang
  const navigate = useNavigate();
  // Ref cho dropdown
  const dropdownRef = useRef(null);

  // useEffect để tìm kiếm gợi ý khi ô tìm kiếm thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchTerm.trim() !== "") {
          const response = await axios.get(
            `${url}/api/food/search?search=${searchTerm}`
          );
          const data = response.data.data;
          setSuggestions(data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  // Hook useEffect để ẩn dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Ẩn danh sách thả xuống khi nhấp vào bên ngoài danh sách thả xuống
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // useEffect để ẩn dropdown khi điều hướng
  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    setShowMobileDropdown(false);
  }, [navigate]);

  // useEffect để tìm kiếm gợi ý cho mobile khi ô tìm kiếm thay đổi
  useEffect(() => {
    const fetchMobileData = async () => {
      try {
        if (mobileSearchTerm.trim() !== "") {
          const response = await axios.get(
            `${url}/api/food/search?search=${mobileSearchTerm}`
          );
          const data = response.data.data;
          setMobileSuggestions(data);
          setShowMobileDropdown(true);
        } else {
          setMobileSuggestions([]);
          setShowMobileDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching mobile data:", error);
      }
    };

    fetchMobileData();
  }, [mobileSearchTerm, url]);

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setShowMobileMenu(false);
  };

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?search=${searchTerm}`);
    }
  };

  // Hàm xử lý mobile search
  const handleMobileSearch = () => {
    if (mobileSearchTerm.trim() !== "") {
      navigate(`/search?search=${mobileSearchTerm}`);
      setShowMobileMenu(false);
      setMobileSearchTerm("");
      setShowMobileDropdown(false);
    }
  };

  // Hàm xử lý khi nhấn vào gợi ý tìm kiếm
  const handleSuggestionClick = (id) => {
    navigate(`/food/${id}`);
  };

  // Hàm xử lý khi nhấn vào gợi ý tìm kiếm mobile
  const handleMobileSuggestionClick = (id) => {
    navigate(`/food/${id}`);
    setShowMobileMenu(false);
    setMobileSearchTerm("");
    setShowMobileDropdown(false);
  };

  // Hàm xử lý khi nhấn phím Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Hàm xử lý khi nhấn phím Enter trong ô tìm kiếm mobile
  const handleMobileKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMobileSearch();
    }
  };

  // Hàm xử lý mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Hàm xử lý contact us cho mobile
  const handleContactUs = (e) => {
    e.preventDefault();
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
    setShowMobileMenu(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="">
          <img src={assets.logo} alt="" className="logo" />
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="navbar-menu">
          <li>
            <Link to="/">home</Link>
          </li>
          <li>
            <Link to="/menu">menu</Link>
          </li>
          <li>
            <Link to="/notification">notification</Link>
          </li>
          <li>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              contact us
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-search" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowDropdown(true)}
          />
          <button onClick={handleSearch}>
            <img className="search-icon" src={assets.search_icon} alt="" />
          </button>
          {showDropdown && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((product, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product._id)}
                >
                  <img
                    className="img"
                    src={url + "/images/" + product.image}
                    alt={product.name}
                  />
                  <span className="name">{product.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" className="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={() => navigate("/profile")}>
                <img src={assets.info_icon} alt="" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
        {/* Mobile menu toggle button */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`mobile-menu ${showMobileMenu ? "active" : ""}`}>
        {/* Mobile search bar */}
        <div className="mobile-search">
          <input
            type="text"
            placeholder="Search for food..."
            value={mobileSearchTerm}
            onChange={(e) => setMobileSearchTerm(e.target.value)}
            onKeyPress={handleMobileKeyPress}
            onFocus={() => setShowMobileDropdown(true)}
          />
          {showMobileDropdown && mobileSuggestions.length > 0 && (
            <div className="mobile-search-results">
              {mobileSuggestions.map((product, index) => (
                <div
                  key={index}
                  className="mobile-search-result-item"
                  onClick={() => handleMobileSuggestionClick(product._id)}
                >
                  <img
                    src={url + "/images/" + product.image}
                    alt={product.name}
                  />
                  <span className="name">{product.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <ul>
          <li>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" onClick={() => setShowMobileMenu(false)}>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/notification" onClick={() => setShowMobileMenu(false)}>
              Notification
            </Link>
          </li>
          <li>
            <a href="#footer" onClick={handleContactUs}>
              Contact Us
            </a>
          </li>
          {token && (
            <>
              <li>
                <Link to="/myorders" onClick={() => setShowMobileMenu(false)}>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setShowMobileMenu(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <a href="#" onClick={logout}>
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;
