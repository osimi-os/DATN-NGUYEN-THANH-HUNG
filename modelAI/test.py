import requests

# Gọi API để lấy gợi ý cho sản phẩm
def call_api(item_name):
    # Địa chỉ URL của API
    url = "http://localhost:4040/recommend/"

    # Tham số được gửi cùng với yêu cầu GET
    params = {
        "item_name": item_name,
    }

    # Gửi yêu cầu GET đến API với các tham số
    response = requests.get(url, params=params)

    # Kiểm tra mã trạng thái của phản hồi
    if response.status_code == 404:
        print("Item not found")
        return []
    elif response.status_code != 200:
        print("An error occurred")
        return []
    
    # Chuyển đổi phản hồi JSON thành dữ liệu Python
    data = response.json()

    # Trả về danh sách các gợi ý từ dữ liệu nhận được
    return data["recommendations"]

# Kiểm tra
test = call_api('Chocolate crinkles')
print(test)