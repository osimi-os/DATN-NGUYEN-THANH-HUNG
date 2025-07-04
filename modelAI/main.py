from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from recommend import recommend, get_user_insights, AdvancedRecommendationSystem

app = FastAPI()

# Thêm middleware CORS để cho phép truy cập từ mọi nguồn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Có thể điều chỉnh điều này để hạn chế hơn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đường dẫn đến thư mục chứa dữ liệu
cd = os.getcwd()
data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
# Load dữ liệu vào DataFrame từ tệp CSV
df = pd.read_csv(os.path.join(data_path,'data.csv'))

# Khởi tạo hệ thống recommendation nâng cao
rec_system = AdvancedRecommendationSystem(df)

# Kiểm tra xem máy chủ đã kết nối chưa
@app.get("/ping")
def pong():
    return {"ping": "pong!"}

# Lấy các gợi ý từ tên mặt hàng và tên người dùng
@app.get("/recommend/")
async def get_recommendations(item_name: str, user_name: str = "anonymous"):
    print(f"Getting recommendations for item: {item_name}, user: {user_name}")
    
    # Đọc dữ liệu từ tệp CSV mỗi lần có yêu cầu
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem mặt hàng có trong dữ liệu không
    if item_name not in df['Items'].values: 
        # Nếu không tìm thấy, ném ra một ngoại lệ HTTP 404
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Gọi hàm recommend để lấy các gợi ý dựa trên tên mặt hàng và tên người dùng
    recommendations = recommend(item_name, df=df, user=user_name, isLogin=(user_name != "anonymous"))
    
    return {
        "recommendations": recommendations,
        "algorithm": "Advanced Hybrid Recommendation System",
        "user": user_name,
        "item": item_name
    }

# API mới: Lấy insights về hành vi người dùng
@app.get("/user-insights/")
async def get_user_behavior_insights(user_name: str):
    print(f"Getting user insights for: {user_name}")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem user có trong dữ liệu không
    if user_name not in df['User'].values:
        return {
            "user": user_name,
            "insights": {},
            "message": "User not found in dataset"
        }
    
    # Lấy insights về hành vi người dùng
    insights = get_user_insights(user_name, df)
    
    return {
        "user": user_name,
        "insights": insights,
        "message": "User behavior insights retrieved successfully"
    }

# API mới: Lấy recommendations dựa trên content-based filtering
@app.get("/content-based/")
async def get_content_based_recommendations(item_name: str, n_recommendations: int = 10):
    print(f"Getting content-based recommendations for item: {item_name}")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem mặt hàng có trong dữ liệu không
    if item_name not in df['Items'].values:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Khởi tạo hệ thống recommendation
    rec_system = AdvancedRecommendationSystem(df)
    
    # Lấy content-based recommendations
    recommendations = rec_system.content_based_recommendations(item_name, n_recommendations)
    
    return {
        "recommendations": recommendations,
        "algorithm": "Content-Based Filtering",
        "item": item_name,
        "count": len(recommendations)
    }

# API mới: Lấy recommendations dựa trên collaborative filtering
@app.get("/collaborative/")
async def get_collaborative_recommendations(user_name: str, n_recommendations: int = 10):
    print(f"Getting collaborative recommendations for user: {user_name}")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem user có trong dữ liệu không
    if user_name not in df['User'].values:
        return {
            "recommendations": [],
            "algorithm": "Collaborative Filtering",
            "user": user_name,
            "message": "User not found in dataset"
        }
    
    # Khởi tạo hệ thống recommendation
    rec_system = AdvancedRecommendationSystem(df)
    
    # Lấy collaborative filtering recommendations
    recommendations = rec_system.collaborative_filtering_recommendations(user_name, n_recommendations)
    
    return {
        "recommendations": recommendations,
        "algorithm": "Collaborative Filtering",
        "user": user_name,
        "count": len(recommendations)
    }

# API mới: Lấy recommendations dựa trên matrix factorization
@app.get("/matrix-factorization/")
async def get_matrix_factorization_recommendations(user_name: str, n_recommendations: int = 10):
    print(f"Getting matrix factorization recommendations for user: {user_name}")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem user có trong dữ liệu không
    if user_name not in df['User'].values:
        return {
            "recommendations": [],
            "algorithm": "Matrix Factorization (NMF)",
            "user": user_name,
            "message": "User not found in dataset"
        }
    
    # Khởi tạo hệ thống recommendation
    rec_system = AdvancedRecommendationSystem(df)
    
    # Lấy matrix factorization recommendations
    recommendations = rec_system.matrix_factorization_recommendations(user_name, n_recommendations)
    
    return {
        "recommendations": recommendations,
        "algorithm": "Matrix Factorization (NMF)",
        "user": user_name,
        "count": len(recommendations)
    }

# API mới: So sánh các thuật toán recommendation
@app.get("/compare-algorithms/")
async def compare_recommendation_algorithms(item_name: str, user_name: str = "anonymous"):
    print(f"Comparing algorithms for item: {item_name}, user: {user_name}")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))

    # Kiểm tra xem mặt hàng có trong dữ liệu không
    if item_name not in df['Items'].values:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Khởi tạo hệ thống recommendation
    rec_system = AdvancedRecommendationSystem(df)
    
    # Lấy recommendations từ các thuật toán khác nhau
    results = {
        "hybrid": rec_system.hybrid_recommendations(item_name, user_name, 10),
        "content_based": rec_system.content_based_recommendations(item_name, 10),
        "item_based": rec_system.item_based_collaborative_filtering(item_name, 10)
    }
    
    # Thêm collaborative filtering nếu user đã đăng nhập
    if user_name != "anonymous" and user_name in df['User'].values:
        results["collaborative"] = rec_system.collaborative_filtering_recommendations(user_name, 10)
        results["matrix_factorization"] = rec_system.matrix_factorization_recommendations(user_name, 10)
    
    return {
        "item": item_name,
        "user": user_name,
        "algorithms": results,
        "message": "Algorithm comparison completed"
    }

# API mới: Thống kê hệ thống recommendation
@app.get("/system-stats/")
async def get_system_statistics():
    print("Getting system statistics")
    
    # Đọc dữ liệu từ tệp CSV
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path,'data.csv'))
    
    # Tính toán thống kê
    stats = {
        "total_records": len(df),
        "unique_users": df['User'].nunique(),
        "unique_items": df['Items'].nunique(),
        "unique_categories": df['Category'].nunique(),
        "avg_rating": df['Rating'].mean(),
        "rating_distribution": df['Rating'].value_counts().to_dict(),
        "top_users": df['User'].value_counts().head(10).to_dict(),
        "top_items": df['Items'].value_counts().head(10).to_dict(),
        "category_distribution": df['Category'].value_counts().to_dict()
    }
    
    return {
        "statistics": stats,
        "message": "System statistics retrieved successfully"
    }

