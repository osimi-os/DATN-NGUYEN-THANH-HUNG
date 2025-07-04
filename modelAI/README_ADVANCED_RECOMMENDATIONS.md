# Hệ Thống Recommendation Nâng Cao - Yumm! Bakery

## Tổng Quan

Hệ thống recommendation nâng cao được thiết kế để cung cấp gợi ý sản phẩm dựa trên hành vi mua hàng thực tế của người dùng. Hệ thống kết hợp nhiều thuật toán khác nhau để tối ưu hóa trải nghiệm người dùng.

## Các Thuật Toán Được Sử Dụng

### 1. Content-Based Filtering

- **Mô tả**: Dựa trên đặc tính sản phẩm (category, daypart, daytype)
- **Ưu điểm**: Không cần dữ liệu người dùng, phù hợp cho users mới
- **API**: `/content-based/?item_name=Toast&n_recommendations=10`

### 2. Collaborative Filtering

- **Mô tả**: Dựa trên hành vi của các users tương tự
- **Ưu điểm**: Phát hiện patterns ẩn trong hành vi người dùng
- **API**: `/collaborative/?user_name=Adam&n_recommendations=10`

### 3. Matrix Factorization (NMF)

- **Mô tả**: Sử dụng Non-negative Matrix Factorization để tìm latent factors
- **Ưu điểm**: Xử lý tốt dữ liệu thưa, phát hiện patterns phức tạp
- **API**: `/matrix-factorization/?user_name=Adam&n_recommendations=10`

### 4. Hybrid Approach

- **Mô tả**: Kết hợp tất cả các thuật toán trên
- **Ưu điểm**: Tối ưu hóa độ chính xác và đa dạng
- **API**: `/recommend/?item_name=Toast&user_name=Adam`

## Cài Đặt và Chạy

### 1. Cài đặt dependencies

```bash
cd modelAI
pip install -r requirements.txt
```

### 2. Khởi động AI service

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test hệ thống

```bash
python test_advanced_recommendations.py
```

## API Endpoints

### 1. Recommendation Chính

```
GET /recommend/?item_name=Toast&user_name=Adam
```

**Response:**

```json
{
  "recommendations": ["Bread", "Coffee", "Tea", ...],
  "algorithm": "Advanced Hybrid Recommendation System",
  "user": "Adam",
  "item": "Toast"
}
```

### 2. User Behavior Insights

```
GET /user-insights/?user_name=Adam
```

**Response:**

```json
{
  "user": "Adam",
  "insights": {
    "total_ratings": 62,
    "avg_rating": 3.2,
    "preferred_categories": { "Beverages": 25, "Pure Veg": 20 },
    "preferred_dayparts": { "Afternoon": 35, "Morning": 27 },
    "rating_distribution": { "5.0": 15, "4.0": 20, "3.0": 15 }
  },
  "message": "User behavior insights retrieved successfully"
}
```

### 3. Content-Based Filtering

```
GET /content-based/?item_name=Coffee&n_recommendations=5
```

### 4. Collaborative Filtering

```
GET /collaborative/?user_name=Adam&n_recommendations=5
```

### 5. Matrix Factorization

```
GET /matrix-factorization/?user_name=Adam&n_recommendations=5
```

### 6. So Sánh Thuật Toán

```
GET /compare-algorithms/?item_name=Toast&user_name=Adam
```

### 7. Thống Kê Hệ Thống

```
GET /system-stats/
```

## Tích Hợp Với Backend

Backend đã được cập nhật để tích hợp với AI service:

### 1. Cập nhật foodController.js

- Thêm logic gọi AI service
- Fallback về category-based nếu AI service không khả dụng
- Phân tích hành vi mua hàng từ order history

### 2. API Response Format

```json
{
  "success": true,
  "recommendations": [
    {
      "name": "Bread",
      "price": 2.5,
      "image": "bread.jpg",
      "category": "Pure Veg",
      "description": "Fresh baked bread"
    }
  ],
  "message": "AI recommendations generated successfully",
  "algorithm": "AI-Powered Collaborative Filtering"
}
```

## Cấu Trúc Dữ Liệu

### Dataset Format

```csv
User,Items,Rating,Category,Daypart,Daytype
Adam,Toast,4.0,Pure Veg,Morning,Weekday
Adam,Coffee,5.0,Beverages,Afternoon,Weekend
...
```

### Các Trường Dữ Liệu

- **User**: Tên người dùng
- **Items**: Tên sản phẩm
- **Rating**: Đánh giá (0-5)
- **Category**: Danh mục sản phẩm
- **Daypart**: Thời gian trong ngày (Morning/Afternoon/Evening/Night)
- **Daytype**: Loại ngày (Weekday/Weekend)

## Hiệu Suất và Tối Ưu Hóa

### 1. Caching

- User-item matrix được tính toán một lần và cache
- Similarity matrices được pre-compute
- NMF model được fit một lần

### 2. Fallback Strategy

- Nếu AI service không khả dụng → Category-based
- Nếu user chưa đăng nhập → Content-based + Item-based
- Nếu user có ít dữ liệu → Hybrid approach

### 3. Performance Metrics

- Khởi tạo hệ thống: ~2-3 giây
- Mỗi recommendation: ~0.1-0.3 giây
- Throughput: ~3-10 recommendations/giây

## Monitoring và Analytics

### 1. System Statistics

- Tổng số records, users, items
- Phân bố ratings và categories
- Top users và items

### 2. User Behavior Analysis

- Số lượng ratings của user
- Rating trung bình
- Categories ưa thích
- Patterns theo thời gian

### 3. Algorithm Performance

- So sánh kết quả giữa các thuật toán
- Độ chính xác và đa dạng
- Thời gian xử lý

## Troubleshooting

### 1. AI Service Không Khởi Động

```bash
# Kiểm tra dependencies
pip install -r requirements.txt

# Kiểm tra port
netstat -an | findstr :8000

# Khởi động với debug
uvicorn main:app --reload --log-level debug
```

### 2. Recommendations Không Chính Xác

- Kiểm tra dữ liệu trong `data.csv`
- Verify user và item names
- Test với different algorithms

### 3. Performance Issues

- Giảm số lượng recommendations
- Sử dụng caching
- Optimize data loading

## Tương Lai Phát Triển

### 1. Real-time Learning

- Cập nhật model theo thời gian thực
- Online learning algorithms
- A/B testing framework

### 2. Advanced Features

- Context-aware recommendations
- Seasonal patterns
- Price sensitivity analysis
- Cross-selling recommendations

### 3. Integration Enhancements

- Real-time order data integration
- User feedback loop
- Personalized marketing campaigns

## Liên Hệ và Hỗ Trợ

Để báo cáo bugs hoặc đề xuất cải tiến, vui lòng tạo issue trong repository hoặc liên hệ team phát triển.
