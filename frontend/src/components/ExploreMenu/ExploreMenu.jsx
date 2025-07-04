import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import PropTypes from "prop-types";

// Component ExploreMenu để hiển thị danh sách menu và cho phép người dùng chọn danh mục
const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="ExploreMenu" id="explore-menu">
      {/* Thẻ div chứa danh sách các mục menu */}
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            // Khi được click, nó sẽ gọi hàm setCategory để thay đổi danh mục hiện tại
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default ExploreMenu;
