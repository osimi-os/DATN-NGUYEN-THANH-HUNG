import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

// Trang Verify để xứ đơn hàng sau khi thanh toán
const Verify = () => {
    
    // Lấy tham số từ query string
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url } = useContext(StoreContext);
    const navigate = useNavigate()

    // Hàm xác minh thanh toán
    const verifyPayment = async () => {
        // Gửi yêu cầu xác minh thanh toán đến API
        const response = await axios.post(url + "/api/order/verify", {success, orderId})
        if (response.data.success) {
            // Điều hướng đến trang 'myorders' nếu xác minh thành công
            navigate("/myorders")
        } else {
            // Điều hướng về trang chủ trong trường hợp lỗi
            navigate("/")
        }
    }

    // Gọi hàm verifyPayment khi component được tải lần đầu
    useEffect(() => {
        verifyPayment();
    }, [])

  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify
