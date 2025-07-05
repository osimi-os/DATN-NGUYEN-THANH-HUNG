### Cài Đặt

1. Clone dự án về máy của bạn: `git clone https://github.com/osimi-os/DATN-NGUYEN-THANH-HUNG.git`
2. Khởi động server:
   - Cài đặt tất cả các thư viện cần thiết: `npm run install-all`
   - Khởi chạy toàn bộ ứng dụng: `npm run app`
   - Để chạy server và admin panel: `npm run seller`
   - Khởi động AI server:`python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

---

### Chạy AI Recommendation Server (Python)

1. Mở terminal/cmd và chuyển vào thư mục modelAI:
   ```bash
   cd modelAI
   ```
2. Cài đặt các thư viện Python cần thiết:
   ```bash
   pip install -r requirements.txt
   # Hoặc nếu gặp lỗi với orjson, chỉ cần:
   pip install fastapi uvicorn pandas scikit-learn numpy
   ```
3. Khởi động AI server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
4. Kiểm tra server đã chạy:
   - Truy cập http://localhost:8000/ping trên trình duyệt, nếu trả về `{"ping": "pong!"}` là thành công.

> **Lưu ý:**
>
> - Đảm bảo file `data.csv` nằm trong thư mục `modelAI/data/`.
> - Luôn chạy lệnh khởi động AI server trong đúng thư mục `modelAI`.
