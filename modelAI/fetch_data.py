import pandas as pd
import requests

# Địa chỉ URL của API cần truy cập
url = 'http://localhost:4000'

# Fetch_data_from_api dùng để lấy dữ liệu từ MongoDB thông qua API
def fetch_data_from_api(url):
    try:
        # Gửi yêu cầu GET đến API để lấy dữ liệu
        response = requests.get(f"{url}/api/food/list")

        response.raise_for_status()  # Ném ra một ngoại lệ cho các mã trạng thái 4XX và 5XX

         # Chuyển đổi dữ liệu nhận được từ JSON sang DataFrame nếu thành công
        data = response.json()
        if data['success']:
            return pd.DataFrame(data['data'])  # Chuyển đổi dữ liệu JSON nhận được thành DataFrame
        else:
            print("Error: Failed to fetch data from the API.")
            return None
    except requests.exceptions.RequestException as e:
        # Hiển thị lỗi nếu có lỗi xảy ra trong quá trình gửi yêu cầu
        print(f"Error: {e}")
        return None

