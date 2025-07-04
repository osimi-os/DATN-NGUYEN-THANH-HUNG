# Hướng Dẫn Sử Dụng Page Report - Yumm! Admin

## Tổng Quan

Page Report cung cấp các báo cáo chi tiết về hoạt động kinh doanh của Yumm! Bakery, bao gồm doanh thu, đơn hàng, khách hàng và các thống kê quan trọng khác.

## Các Tính Năng Chính


### 1. Bộ Lọc Thời Gian

- **6 tháng gần nhất**: Mặc định, hiển thị dữ liệu 6 tháng gần nhất
- **3 tháng gần nhất**: Hiển thị dữ liệu 3 tháng gần nhất
- **12 tháng gần nhất**: Hiển thị dữ liệu 12 tháng gần nhất
- **Tất cả**: Hiển thị toàn bộ dữ liệu từ khi bắt đầu

### 2. Thẻ Tổng Quan (Summary Cards)

- **Tổng Doanh Thu**: Tổng doanh thu trong khoảng thời gian được chọn
- **Tổng Đơn Hàng**: Số lượng đơn hàng trong khoảng thời gian
- **Tổng Khách Hàng**: Tổng số khách hàng đã đăng ký
- **Tỷ Lệ Thanh Toán**: Phần trăm đơn hàng đã thanh toán
- **Tỷ Lệ Đánh Giá**: Phần trăm đơn hàng đã được đánh giá

### 3. Biểu Đồ Doanh Thu Theo Tháng

- Hiển thị doanh thu theo từng tháng
- Dạng biểu đồ area chart với màu gradient
- Tooltip hiển thị doanh thu chi tiết khi hover

### 4. Biểu Đồ Doanh Thu Theo Trạng Thái Đơn Hàng

- Phân tích doanh thu theo trạng thái đơn hàng
- Dạng biểu đồ cột (bar chart)
- Giúp hiểu rõ hiệu quả của từng giai đoạn xử lý đơn hàng

### 5. Top 10 Khách Hàng Theo Doanh Thu

- Danh sách 10 khách hàng có doanh thu cao nhất
- Biểu đồ cột ngang (horizontal bar chart)
- Giúp xác định khách hàng VIP

### 6. Phân Bố Đơn Hàng Theo Trạng Thái

- Biểu đồ tròn (pie chart) thể hiện tỷ lệ đơn hàng theo trạng thái
- Màu sắc khác nhau cho từng trạng thái
- Hiển thị phần trăm trên mỗi phần

### 7. Đơn Hàng Theo Ngày Trong Tuần

- Biểu đồ đường (line chart) thể hiện xu hướng đơn hàng theo ngày
- Giúp xác định ngày nào có nhiều đơn hàng nhất
- Hỗ trợ lập kế hoạch nhân sự

### 8. Thống Kê Chi Tiết

- **Doanh Thu Trung Bình/Đơn**: Giá trị trung bình mỗi đơn hàng
- **Đơn Hàng Chưa Thanh Toán**: Số đơn hàng chưa hoàn tất thanh toán
- **Đơn Hàng Chưa Đánh Giá**: Số đơn hàng chưa được khách hàng đánh giá

### 9. Xuất Báo Cáo

- Nút "Xuất Báo Cáo (PDF)" để tải về file báo cáo
- File được tạo dưới dạng text với định dạng dễ đọc
- Tên file: `bao-cao-yumm-YYYY-MM-DD.txt`

## Cách Sử Dụng

### Xem Báo Cáo

1. Truy cập vào page Report từ admin panel
2. Chọn khoảng thời gian mong muốn từ dropdown "Lọc theo thời gian"
3. Dữ liệu sẽ tự động cập nhật theo lựa chọn

### Xuất Báo Cáo

1. Chọn khoảng thời gian cần xuất báo cáo
2. Nhấn nút "Xuất Báo Cáo (PDF)"
3. File sẽ được tải về máy tính

### Phân Tích Dữ Liệu

- **Doanh thu tăng/giảm**: Quan sát biểu đồ doanh thu theo tháng
- **Hiệu quả xử lý đơn hàng**: Xem biểu đồ doanh thu theo trạng thái
- **Khách hàng VIP**: Kiểm tra top 10 khách hàng
- **Xu hướng đặt hàng**: Phân tích đơn hàng theo ngày trong tuần

## Lưu Ý Kỹ Thuật

### API Endpoint

- URL: `GET /api/order/report`
- Query parameter: `timeFilter` (3, 6, 12, all)
- Response: JSON với cấu trúc dữ liệu báo cáo

### Dependencies

- **Frontend**: React, Recharts, Axios, PropTypes
- **Backend**: Express, Mongoose
- **Database**: MongoDB

### Responsive Design

- Tương thích với desktop, tablet và mobile
- Biểu đồ tự động điều chỉnh kích thước
- Layout responsive cho các thiết bị khác nhau

## Troubleshooting

### Lỗi Thường Gặp

1. **Không tải được dữ liệu**: Kiểm tra kết nối database và API
2. **Biểu đồ không hiển thị**: Đảm bảo có dữ liệu trong khoảng thời gian chọn
3. **Xuất báo cáo lỗi**: Kiểm tra quyền ghi file trên trình duyệt

### Debug

- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Đảm bảo backend server đang chạy

## Cập Nhật Tương Lai

- Thêm biểu đồ doanh thu theo sản phẩm
- Tính năng so sánh theo thời gian
- Export PDF thực sự thay vì text file
- Dashboard real-time với WebSocket
- Thêm các metrics KPI khác
