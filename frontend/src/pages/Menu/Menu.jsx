import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Menu.css";

const Menu = () => {
  const [category, setCategory] = useState("All");
  return (
    <div className="menu-page-container">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our delicious selection. Choose a category to explore!</p>
      </div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Menu; 