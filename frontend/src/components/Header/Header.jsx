import "./Header.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Trang Đỗ
// Component Header để hiển thị phần tiêu đề của trang web
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="header-overlay" />
      <motion.div
        className="header-contents"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Delicious Artisanal Sandwiches Await!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Explore a diverse menu brimming with mouthwatering sandwiches,
          meticulously crafted using premium ingredients and culinary flair. Our
          goal? To tantalize your taste buds and elevate your sandwich game, one
          bite at a time.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #00000033" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/menu")}
        >
          View Menu
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Header;
