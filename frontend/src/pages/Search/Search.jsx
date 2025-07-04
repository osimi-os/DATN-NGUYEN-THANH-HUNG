import React, { useContext, useState, useEffect } from 'react';
import './Search.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Search = () => {
    const { url } = useContext(StoreContext);
    // State lưu trữ từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    // State lưu trữ kết quả tìm kiếm
    const [searchResult, setSearchResult] = useState([]);
    // State để kiểm tra xem có món ăn nào không
    const [noFoodFound, setNoFoodFound] = useState(false);
    const location = useLocation(); // Lấy location

    useEffect(() => {
        // Lấy tham số tìm kiếm từ query string
        const searchParams = new URLSearchParams(location.search);
        // Lấy giá trị của tham số 'search'
        const term = searchParams.get('search');
        // Cập nhật state searchTerm
        setSearchTerm(term);
        // Gọi hàm handleSearch khi searchTerm thay đổi
        handleSearch(term);
    }, [location.search]);

    // Hàm xử lý tìm kiếm món ăn dựa trên từ khóa
    const handleSearch = async (term) => { // Thêm tham số term vào hàm handleSearch
        try {
            const response = await axios.get(`${url}/api/food/search?search=${term}`);
            const data = response.data.data;
            if (data.length === 0) {
                setNoFoodFound(true);
            } else {
                setSearchResult(data);
                setNoFoodFound(false);
            }
        } catch (error) {
            console.error('Error searching for food:', error);
        }
    };

    return (
        <div className='search-container'>
            <h1 className="title-search">Search results </h1>
            <div className="search-results">
                {noFoodFound ? (
                    <div>No food</div>
                ) : (
                    searchResult.map((food) => (
                        <FoodItem
                            key={food._id}
                            id={food._id}
                            name={food.name}
                            price={food.price}
                            description={food.description}
                            image={food.image}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;
