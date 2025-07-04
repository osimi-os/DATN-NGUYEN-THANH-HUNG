## Checklist Hoàn Thiện Chức Năng Hệ Thống

### ĐÃ LÀM ĐƯỢC

- [x] Đăng ký và đăng nhập tài khoản (Customer & Admin)
- [x] Xem sản phẩm, tìm kiếm sản phẩm theo danh mục hoặc từ khóa
- [x] Thêm sản phẩm vào giỏ hàng, xem và chỉnh sửa giỏ hàng
- [x] Thanh toán đơn hàng (bao gồm chọn phương thức thanh toán)
- [x] Xem và đánh giá sản phẩm
- [x] Nhận gợi ý sản phẩm từ hệ thống AI (đã có recommend.py, API, tích hợp frontend)
- [x] Quản lý sản phẩm (Admin: thêm, sửa, xóa, xem)
- [x] Quản lý đơn hàng (Admin: xem, xác nhận, hủy, xem chi tiết)
- [x] Quản lý người dùng (Admin: xem, xóa, xem chi tiết)
- [x] Báo cáo/thống kê đơn hàng, doanh thu, khách hàng (Admin)
- [x] Chức năng thông báo (notification) cho khách hàng và admin về sản phẩm mới, khuyến mãi, v.v. (đã hoàn thiện gửi/nhận, giao diện đẹp, quản lý bài viết)
- [x] Quản lý đánh giá sản phẩm (Admin: duyệt/xóa đánh giá, user đánh giá đơn hàng, giao diện đẹp)
- [x] Tích hợp thanh toán trực tuyến thực tế (đã có luồng thanh toán, xác nhận, trạng thái đơn hàng)
- [x] Giao diện/thao tác quản lý nâng cao cho Admin (sidebar, popup, phân quyền, thao tác CRUD hiện đại)
- [x] Tối ưu UX/UI cho các luồng phụ, xử lý lỗi, ngoại lệ (giao diện responsive, popup, thông báo lỗi, xác nhận, UX tốt)
- [x] Đề xuất sản phẩm dựa trên hành vi mua hàng thực tế (AI hiện tại chủ yếu dựa trên content-based, cần bổ sung/hoàn thiện collaborative filtering, hành vi thực tế)
- [x] Quản lý thông báo (Admin: tạo, gửi, xóa thông báo)

### CHƯA LÀM HOẶC CẦN HOÀN THIỆN THÊM

- [ ] Giao diện/thao tác quản lý nâng cao cho Admin (phân quyền, logs, v.v. nếu cần)

---

PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
1 Mô hình hóa yêu cầu
1.1 Xác định các tác nhân
Khách hàng (Customer):
• Đăng ký và đăng nhập vào tài khoản.
• Xem sản phẩm, tìm kiếm sản phẩm theo danh mục hoặc từ khóa.
• Thêm sản phẩm vào giỏ hàng, xem và chỉnh sửa giỏ hàng.
• Thanh toán đơn hàng.
• Xem và đánh giá sản phẩm.
• Nhận gợi ý sản phẩm từ hệ thống AI.
Quản trị viên (Admin):
• Quản lý sản phẩm (Manage Products)
• Quản lý đơn hàng (Manage Orders)
• Quản lý người dùng (Manage Users)
Chức năng cho hệ thống AI:
• Phân tích hành vi mua hàng của khách hàng.
• Đề xuất sản phẩm dựa trên hành vi mua hàng.

1.2 Biểu đồ case sử dụng
a. Usecase tổng quát

Hình 1 Use case tổng quan
b. Các usecase chính
Use case Quản Lý Sản Phẩm

Hình 2 Use case quản lý sản phẩm
Use-case Quản Lý
Actor Admin
Mô tả Admin có thể xem, thêm, sửa đổi thông tin sản phẩm trong hệ thống
Điều kiện kích hoạt Admin đăng nhập vào hệ thống
Tiền điều kiện Đã đăng nhập vào hệ thống
Hậu điều kiện Thông báo đăng nhập thành công
Luồng sự kiện chính • Người quản trị bắt đầu quản lý sản phẩm.
• Hệ thống hiển thị danh sách sản phẩm hiện có.
• Người quản trị chọn một trong các tùy chọn: thêm sản phẩm mới, cập nhật thông tin sản phẩm hoặc xóa sản phẩm.
• Hệ thống thực hiện hành động tương ứng theo lựa chọn của người quản trị.
• Luồng sự kiện kết thúc.

Luồng sự kiện rẽ nhánh Luồng sự kiện rẽ nhánh (Cập nhật thông tin Sản phẩm):

1. Người quản trị chọn tùy chọn "Cập nhật thông tin Sản phẩm".
2. Hệ thống hiển thị danh sách sản phẩm hiện có và yêu cầu chọn sản phẩm cần cập nhật thông tin.
3. Người quản trị chọn sản phẩm cần cập nhật thông tin.
4. Hệ thống hiển thị biểu mẫu cho phép người quản trị cập nhật thông tin của sản phẩm được chọn.
5. Người quản trị cập nhật thông tin sản phẩm.
6. Hệ thống kiểm tra và cập nhật thông tin sản phẩm.
7. Hệ thống hiển thị thông báo xác nhận thành công.
8. Luồng sự kiện kết thúc.
   Luồng sự kiện rẽ nhánh (Xóa Sản phẩm):
9. Người quản trị chọn tùy chọn "Xóa Sản phẩm".
10. Hệ thống hiển thị danh sách sản phẩm hiện có và yêu cầu chọn sản phẩm cần xóa.
11. Người quản trị chọn sản phẩm cần xóa.
12. Hệ thống hiển thị xác nhận yêu cầu xóa sản phẩm.
13. Người quản trị xác nhận yêu cầu xóa sản phẩm.
14. Hệ thống kiểm tra và xóa sản phẩm khỏi cơ sở dữ liệu.
15. Hệ thống hiển thị thông báo xác nhận thành công.
16. Luồng sự kiện kết thúc.
    Bảng 1 Bảng mô tả quản lý lớp sản phẩm

Use case: Quản lý đơn hàng

Hình 3 Usecase quản lý đơn hàng
Use-case Quản lý sinh đơn hàng
Actor Admin
Mô tả cho phép người quản trị thực hiện các thao tác quản lý liên quan đến đơn hàng trong hệ thống.
Điều kiện kích hoạt Admin đăng nhập vào hệ thống
Tiền điều kiện Đã đăng nhập vào hệ thống
Hậu điều kiện Thông báo đăng nhập thành công
• Luồng sự kiện chính • Người quản trị bắt đầu quản lý đơn hàng.
• Hệ thống hiển thị danh sách các đơn hàng hiện có.
• Người quản trị chọn một trong các tùy chọn: xem danh sách đơn hàng, xem chi tiết đơn hàng, xác nhận đơn hàng hoặc hủy đơn hàng.
• Hệ thống thực hiện hành động tương ứng theo lựa chọn của người quản trị.
• Luồng sự kiện kết thúc.
Luồng sự kiện rẽ nhánh Luồng sự kiện rẽ nhánh (Xác nhận Đơn hàng):

1. Người quản trị chọn tùy chọn "Xác nhận Đơn hàng".
2. Hệ thống hiển thị danh sách các đơn hàng chờ xác nhận.
3. Người quản trị chọn đơn hàng cần xác nhận.
4. Hệ thống thực hiện xác nhận đơn hàng và cập nhật trạng thái.
5. Hệ thống hiển thị thông báo xác nhận thành công.
6. Luồng sự kiện kết thúc.
   Luồng sự kiện rẽ nhánh (Hủy Đơn hàng):
7. Người quản trị chọn tùy chọn "Hủy Đơn hàng".
8. Hệ thống hiển thị danh sách các đơn hàng đang chờ xử lý.
9. Người quản trị chọn đơn hàng cần hủy.
10. Hệ thống hiển thị xác nhận yêu cầu hủy đơn hàng.
11. Người quản trị xác nhận yêu cầu hủy đơn hàng.
12. Hệ thống thực hiện hủy đơn hàng và cập nhật trạng thái.
13. Hệ thống hiển thị thông báo xác nhận thành công.
14. Luồng sự kiện kết thúc.
    Luồng sự kiện rẽ nhánh (Xem chi tiết Đơn hàng):
15. Người quản trị chọn tùy chọn "Xem chi tiết Đơn hàng".
16. Hệ thống hiển thị danh sách các đơn hàng.
17. Người quản trị chọn đơn hàng cần xem chi tiết.
18. Hệ thống hiển thị thông tin chi tiết của đơn hàng.
19. Luồng sự kiện kết thúc.
    Bảng 2 Bảng mô tả quản lý đơn hàng

Usecase quản lý người dùng (Manage Users)

Hình 4 Usecase quản lý người dùng
Use-case Quản lý lớp người dùng
Actor Admin
Mô tả Cho phép người quản trị thực hiện các thao tác quản lý liên quan đến thông tin và tài khoản của người dùng trong hệ thống.
Điều kiện kích hoạt Admin đăng nhập vào hệ thống
Tiền điều kiện Đã đăng nhập vào hệ thống
Hậu điều kiện Thông báo đăng nhập thành công
Luồng sự kiện chính • Người quản trị bắt đầu quản lý người dùng.
• Hệ thống hiển thị danh sách người dùng hiện có.
• Người quản trị chọn một trong các tùy chọn: xem danh sách người dùng, xem chi tiết người dùng hoặc xóa người dùng.
• Hệ thống thực hiện hành động tương ứng theo lựa chọn của người quản trị.
• Luồng sự kiện kết thúc.
Luồng sự kiện rẽ nhánh Luồng sự kiện rẽ nhánh (Xóa Người dùng):

1. Người quản trị chọn tùy chọn "Xóa Người dùng".
2. Hệ thống hiển thị danh sách người dùng hiện có và yêu cầu chọn người dùng cần xóa.
3. Người quản trị chọn người dùng cần xóa.
4. Hệ thống hiển thị xác nhận yêu cầu xóa người dùng.
5. Người quản trị xác nhận yêu cầu xóa người dùng.
6. Hệ thống thực hiện xóa người dùng khỏi cơ sở dữ liệu.
7. Hệ thống hiển thị thông báo xác nhận thành công.
8. Luồng sự kiện kết thúc.
   Luồng sự kiện rẽ nhánh (Xem chi tiết Người dùng):
9. Người quản trị chọn tùy chọn "Xem chi tiết Người dùng".
10. Hệ thống hiển thị danh sách người dùng hiện có và yêu cầu chọn người dùng cần xem chi tiết.
11. Người quản trị chọn người dùng cần xem chi tiết.
12. Hệ thống hiển thị thông tin chi tiết về người dùng.
13. Luồng sự kiện kết thúc.
    3.5

Bảng 3 Bảng mô tả quản lý người dùng
Usecase đăng nhập
Use-case Đăng nhập
Actor Admin, Khách Hàng
Mô tả Use-case cho phép người dùng thực hiện đăng nhập tài khoản trên hệ thống
Điều kiện kích hoạt Khi người dùng muốn đăng nhập vào hệ thống
Tiền điều kiện Đã truy cập vào trang đăng nhập của hệ thống
Hậu điều kiện Thông báo đăng nhập thành công
Luồng sự kiện chính 1. Tác nhân chọn truy cập đến hệ thống để đăng nhập 2. Tác nhân nhập tên đăng nhập, mật khẩu của mình và nhấn nút đăng nhập 3. Hệ thống kiểm tra thông tin đăng nhập. 4. Hệ thống thông báo thành công, phân quyền theo vai trò và chuyển người dùng đến trang phù hợp
Luồng sự kiện rẽ nhánh Nếu tên đăng nhập hoặc mật khẩu không đúng, hệ thống hiện thông báo cho người dùng và yêu cầu đăng nhập lại.
Bảng 5 Bảng mô tả đăng nhập

Usecase Thanh toán đơn hàng của Khách Hàng
Use-case Thanh toán đơn hàng của Khách Hàng
Actor Khách Hàng
Mô tả Khách Hàng có thể thanh toán đơn hàng hoặc thanh toán khi nhận hàng
Điều kiện kích hoạt Khách Hàng Thực Hiện Thanh Toán Đơn Hàng
Tiền điều kiện Khi đã đăng nhập vào hệ thống
Hậu điều kiện Sinh viên đã được điểm danh thành công
Luồng sự kiện chính • Khách hàng chọn sản phẩm và thêm vào giỏ hàng.
• Khách hàng truy cập vào giỏ hàng và xem danh sách sản phẩm đã chọn.
• Khách hàng chọn phương thức thanh toán và điền thông tin liên quan (nếu cần).
• Hệ thống tính toán tổng số tiền cần thanh toán.
• Khách hàng xác nhận và hoàn tất thanh toán.
• Hệ thống ghi nhận đơn hàng và gửi thông báo xác nhận cho khách hàng.
• •Khách hàng nhận được thông báo xác nhận đơn hàng.
Luồng sự kiện rẽ nhánh • Rẽ nhánh 1: Thanh toán trực tuyến:

1. Khách hàng chọn phương thức thanh toán trực tuyến (ví dụ: thẻ tín dụng, ví điện tử).
2. Hệ thống chuyển khách hàng đến cổng thanh toán trực tuyến để hoàn tất giao dịch.
3. Khách hàng nhập thông tin thanh toán và xác nhận giao dịch.
4. Hệ thống xác nhận giao dịch thành công và ghi nhận đơn hàng.
   • Rẽ nhánh 2: Thanh toán khi nhận hàng (COD - Cash on Delivery):
5. Khách hàng chọn phương thức thanh toán khi nhận hàng.
6. Hệ thống ghi nhận đơn hàng và chuẩn bị để giao hàng.
7. Người giao hàng chuyển sản phẩm đến địa chỉ của khách hàng.
8. Khách hàng thanh toán tiền mặt khi nhận sản phẩm.
9. Người giao hàng xác nhận việc thanh toán và hoàn tất giao dịch.
10. Hệ thống ghi nhận giao dịch và gửi thông báo xác nhận đơn hàng cho khách hàng.
    Luồng sự kiện ngoại lệ:
    • Nếu thanh toán thất bại:
    o Hệ thống hiển thị thông báo lỗi và yêu cầu khách hàng thử lại hoặc sử dụng phương thức thanh toán khác.
    • Nếu sản phẩm không còn trong kho:
    o Hệ thống thông báo cho khách hàng về tình trạng sản phẩm và yêu cầu khách hàng chọn sản phẩm khác hoặc đợi cho đến khi sản phẩm được cung cấp lại.
    Bảng 8 Bảng mô tả thanh toán đơn hàng
    Usecase nhận thông báo

Use-case Nhận thông báo
Actor Khách Hàng , Admin
Mô tả thông báo từ về sản phẩm , khuyến mãi , thời gian khuyến mãi của sản phẩm , giới thiệu sản phẩm mới
Điều kiện kích hoạt Khách Hàng Tạo Tài Khoản và Đăng Kí Nhận Thông Báo
Tiền điều kiện Khi đã đăng nhập vào hệ thống
Hậu điều kiện Thông báo được gửi đến khách hàng liên quan
Luồng sự kiện chính • Khách hàng truy cập vào trang thông báo trên website Yumm!.
• Hệ thống hiển thị danh sách thông báo từ Admin.
• Khách hàng đọc các thông báo về sản phẩm, khuyến mãi, thời gian khuyến mãi và giới thiệu sản phẩm mới.
Luồng sự kiện rẽ nhánh Luồng sự kiện chính:

1. Khách hàng truy cập vào trang thông báo trên website Yumm!.
2. Hệ thống hiển thị danh sách thông báo từ Admin.
3. Khách hàng đọc các thông báo về sản phẩm, khuyến mãi, thời gian khuyến mãi và giới thiệu sản phẩm mới.
   Luồng sự kiện rẽ nhánh:
   • Rẽ nhánh 1: Khách hàng quan tâm đến sản phẩm khuyến mãi:
4. Khách hàng chọn thông báo về sản phẩm đang được khuyến mãi.
5. Hệ thống hiển thị thông tin chi tiết về sản phẩm và khuyến mãi.
6. Khách hàng có thể thêm sản phẩm vào giỏ hàng hoặc thực hiện thanh toán trực tiếp.
   • Rẽ nhánh 2: Khách hàng quan tâm đến sản phẩm mới:
7. Khách hàng chọn thông báo về sản phẩm mới.
8. Hệ thống hiển thị thông tin chi tiết về sản phẩm mới.
9. Khách hàng có thể thêm sản phẩm vào giỏ hàng hoặc thực hiện thanh toán trực tiếp.
   • Rẽ nhánh 3: Khách hàng không quan tâm đến thông báo:
10. Khách hàng đóng trang thông báo và tiếp tục duyệt website hoặc thực hiện các hành động khác trên trang web Yumm!.
    Bảng 9 Bảng mô tả nhận thông báo

2.2 Mô hình hóa cấu trúc
2.2.1 Biểu đồ lớp phân tích

Hình 2. 9 Biểu đồ lớp phân tích

2.3. Mô hình hóa hành vi
2.3.1 Biều đồ hoạt động

Hình 2. 10 Biểu đồ hoạt động đăng nhập

Hình 2. 11 Biểu đồ hoạt động: Gợi ý sản phẩm bằng AI

Hình 2. 12 Biểu đồ hoạt động: Thêm sản phẩm vào giỏ hàng

Hình 2. 13 Biểu đồ hoạt động quản lý sản phầm

2.3.2 Biểu đồ tuần tự đăng nhập

Hình 2. 14 Biểu đồ tuần tự đăng nhập của khách hàng

Hình 2. 15 Biểu đồ tuần tự thanh toán

Hình 2. 16 Biểu đồ tuần tự quản lý người dùng
