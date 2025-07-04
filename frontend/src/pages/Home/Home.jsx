import "./Home.css";
import Header from "../../components/Header/Header";
import AppDownload from "../../components/AppDownload/AppDownload";
import FreshCarousel from "../../components/FreshCarousel/FreshCarousel";

// Page Home hiển thị các componenet Header, AppDownload
const Home = () => {
  return (
    <div className="home-padding">
      <Header />
      <FreshCarousel />
      <AppDownload />
    </div>
  );
};

export default Home;
