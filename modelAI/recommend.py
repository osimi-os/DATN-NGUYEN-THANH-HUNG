import numpy as np 
import pandas as pd 
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from sklearn.decomposition import NMF
import random
import os
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

'''
Hệ thống gợi ý sản phẩm nâng cao dựa trên hành vi mua hàng thực tế:
1. Content-based filtering: Dựa trên đặc tính sản phẩm
2. Collaborative filtering: Dựa trên hành vi người dùng
3. Hybrid approach: Kết hợp cả hai phương pháp
4. Real-time behavior analysis: Phân tích hành vi thời gian thực
'''

class AdvancedRecommendationSystem:
    def __init__(self, df):
        self.df = df
        self.user_item_matrix = None
        self.item_similarity_matrix = None
        self.user_similarity_matrix = None
        self.nmf_model = None
        self.tfidf_matrix = None
        self._prepare_data()
    
    def _prepare_data(self):
        """Chuẩn bị dữ liệu cho các thuật toán"""
        try:
            # Tạo user-item matrix
            self.user_item_matrix = self.df.pivot_table(
                index="User", 
                columns="Items", 
                values="Rating", 
                fill_value=0
            )
            
            # Tính toán similarity matrices
            self._compute_similarities()
            
            # Chuẩn bị TF-IDF cho content-based
            self._prepare_content_features()
        except Exception as e:
            print(f"Error preparing data: {e}")
            # Fallback initialization
            self.user_item_matrix = pd.DataFrame()
            self.item_similarity_matrix = np.array([])
            self.user_similarity_matrix = np.array([])
            self.tfidf_matrix = None
    
    def _compute_similarities(self):
        """Tính toán ma trận tương đồng"""
        try:
            if self.user_item_matrix is None or self.user_item_matrix.empty:
                return
                
            # Item similarity
            self.item_similarity_matrix = cosine_similarity(self.user_item_matrix.T)
            
            # User similarity  
            self.user_similarity_matrix = cosine_similarity(self.user_item_matrix)
            
            # NMF model cho latent factors
            n_components = min(20, min(self.user_item_matrix.shape))
            self.nmf_model = NMF(n_components=int(n_components), random_state=42)
            self.nmf_model.fit(self.user_item_matrix)
        except Exception as e:
            print(f"Error computing similarities: {e}")
            self.item_similarity_matrix = np.array([])
            self.user_similarity_matrix = np.array([])
            self.nmf_model = None
    
    def _prepare_content_features(self):
        """Chuẩn bị features cho content-based filtering"""
        try:
            if self.df is None or self.df.empty:
                return
                
            # Tạo description từ category và daypart
            self.df['Description'] = self.df['Category'] + ' ' + self.df['Daypart'] + ' ' + self.df['DayType']
            
            # TF-IDF vectorization
            tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
            self.tfidf_matrix = tfidf.fit_transform(self.df['Description'].fillna(''))
        except Exception as e:
            print(f"Error preparing content features: {e}")
            self.tfidf_matrix = None
    
    def content_based_recommendations(self, item_name, n_recommendations=10):
        """Content-based filtering dựa trên đặc tính sản phẩm"""
        try:
            if self.tfidf_matrix is None or self.df is None:
                return []
                
            # Tìm item trong dataset
            item_data = self.df[self.df['Items'] == item_name]
            if item_data.empty:
                return []
            
            # Tính similarity với tất cả items
            item_idx = item_data.index[0]
            item_similarities = cosine_similarity(
                self.tfidf_matrix[item_idx:item_idx+1], 
                self.tfidf_matrix
            ).flatten()
            
            # Lấy top similar items
            similar_indices = item_similarities.argsort()[-n_recommendations-1:-1][::-1]
            similar_items = self.df.iloc[similar_indices]['Items'].unique()
            
            return [item for item in similar_items if item != item_name]
        except Exception as e:
            print(f"Error in content-based recommendations: {e}")
            return []
    
    def collaborative_filtering_recommendations(self, user_name, n_recommendations=10):
        """Collaborative filtering dựa trên hành vi người dùng"""
        try:
            if (self.user_item_matrix is None or self.user_similarity_matrix is None or 
                user_name not in self.user_item_matrix.index):
                return []
            
            # Lấy user vector
            user_idx = self.user_item_matrix.index.get_loc(user_name)
            user_vector = self.user_item_matrix.iloc[user_idx]
            
            # Tìm users tương tự
            user_similarities = self.user_similarity_matrix[user_idx]
            similar_users = user_similarities.argsort()[-11:-1][::-1]  # Top 10 similar users
            
            # Lấy items mà similar users đã rate cao
            recommendations = defaultdict(float)
            user_rated_items = set(user_vector[user_vector > 0].index)
            
            for similar_user_idx in similar_users:
                similar_user_name = self.user_item_matrix.index[similar_user_idx]
                similar_user_vector = self.user_item_matrix.iloc[similar_user_idx]
                
                # Chỉ xem xét items mà user hiện tại chưa rate
                for item in similar_user_vector.index:
                    if item not in user_rated_items and similar_user_vector[item] > 0:
                        similarity_weight = user_similarities[similar_user_idx]
                        recommendations[item] += similarity_weight * similar_user_vector[item]
            
            # Sắp xếp và trả về top recommendations
            sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
            return [item for item, score in sorted_recommendations[:n_recommendations]]
        except Exception as e:
            print(f"Error in collaborative filtering: {e}")
            return []
    
    def matrix_factorization_recommendations(self, user_name, n_recommendations=10):
        """Matrix factorization sử dụng NMF"""
        try:
            if (self.user_item_matrix is None or self.nmf_model is None or 
                user_name not in self.user_item_matrix.index):
                return []
            
            user_idx = self.user_item_matrix.index.get_loc(user_name)
            
            # Transform user vector
            user_slice = self.user_item_matrix.iloc[user_idx:user_idx+1]
            user_factors = self.nmf_model.transform(user_slice)
            
            # Reconstruct ratings
            predicted_ratings = np.dot(user_factors, self.nmf_model.components_)[0]
            
            # Lấy items có rating cao nhất mà user chưa rate
            user_vector = self.user_item_matrix.iloc[user_idx]
            unrated_items = user_vector[user_vector == 0].index
            
            item_scores = [(item, predicted_ratings[self.user_item_matrix.columns.get_loc(item)]) 
                          for item in unrated_items]
            item_scores.sort(key=lambda x: x[1], reverse=True)
            
            return [item for item, score in item_scores[:n_recommendations]]
        except Exception as e:
            print(f"Error in matrix factorization: {e}")
            return []
    
    def hybrid_recommendations(self, item_name, user_name, n_recommendations=10):
        """Hybrid approach kết hợp nhiều phương pháp"""
        recommendations = []
        
        # 1. Content-based recommendations
        content_recs = self.content_based_recommendations(item_name, n_recommendations//3)
        recommendations.extend(content_recs)
        
        # 2. Collaborative filtering (nếu user đã đăng nhập)
        if user_name and user_name != 'anonymous':
            collab_recs = self.collaborative_filtering_recommendations(user_name, n_recommendations//3)
            recommendations.extend(collab_recs)
            
            # 3. Matrix factorization
            mf_recs = self.matrix_factorization_recommendations(user_name, n_recommendations//3)
            recommendations.extend(mf_recs)
        
        # 4. Item-based collaborative filtering
        item_based_recs = self.item_based_collaborative_filtering(item_name, n_recommendations//4)
        recommendations.extend(item_based_recs)
        
        # Loại bỏ duplicates và giới hạn số lượng
        unique_recommendations = list(dict.fromkeys(recommendations))
        return unique_recommendations[:n_recommendations]
    
    def item_based_collaborative_filtering(self, item_name, n_recommendations=10):
        """Item-based collaborative filtering"""
        try:
            if (self.user_item_matrix is None or self.item_similarity_matrix is None or
                item_name not in self.user_item_matrix.columns):
                return []
            
            item_idx = self.user_item_matrix.columns.get_loc(item_name)
            item_similarities = self.item_similarity_matrix[item_idx]
            
            # Lấy top similar items
            similar_indices = item_similarities.argsort()[-n_recommendations-1:-1][::-1]
            similar_items = self.user_item_matrix.columns[similar_indices]
            
            return [item for item in similar_items if item != item_name]
        except Exception as e:
            print(f"Error in item-based collaborative filtering: {e}")
            return []
    
    def get_user_behavior_insights(self, user_name):
        """Phân tích hành vi người dùng"""
        try:
            if (self.user_item_matrix is None or 
                user_name not in self.user_item_matrix.index):
                return {}
            
            user_vector = self.user_item_matrix.loc[user_name]
            rated_items = user_vector[user_vector > 0]
            
            if len(rated_items) == 0:
                return {}
            
            # Phân tích preferences
            user_items = self.df[self.df['Items'].isin(rated_items.index)]
            
            insights = {
                'total_ratings': len(rated_items),
                'avg_rating': rated_items.mean(),
                'preferred_categories': user_items['Category'].value_counts().to_dict(),
                'preferred_dayparts': user_items['Daypart'].value_counts().to_dict(),
                'preferred_daytypes': user_items['DayType'].value_counts().to_dict(),
                'rating_distribution': rated_items.value_counts().to_dict()
            }
            
            return insights
        except Exception as e:
            print(f"Error getting user insights: {e}")
            return {}

# Hàm tính toán gợi ý dựa trên nội dung sản phẩm (giữ lại cho backward compatibility)
def content_based(item, df):
    # Xóa các bản ghi trùng lặp về mặt hàng
    new_data = df.drop_duplicates(subset = ['Items']).reset_index(drop=True)

    # Định nghĩa một đối tượng TfidfVectorizer để tạo ma trận TF-IDF
    tfidf = TfidfVectorizer(stop_words='english')

    # Thay thế các giá trị NaN bằng một chuỗi trống
    new_data['Description'] = new_data['Description'].fillna('')

    # Tạo ma trận TF-IDF cần thiết bằng cách fit và transform dữ liệu
    tfidf_matrix = tfidf.fit_transform(new_data['Description'])

    # Tính ma trận độ tương đồng cosine
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Xây dựng bản đồ nghịch đảo của chỉ số và tiêu đề sản phẩm
    indices = pd.Series(new_data.index, index=new_data['Items']).drop_duplicates()

    # Lấy chỉ số của sản phẩm phù hợp với tiêu đề
    idx = indices[item]

    # Lấy điểm tương đồng của tất cả các sản phẩm với sản phẩm đó
    sim_scores = cosine_sim[idx] 

    # Sắp xếp các sản phẩm dựa trên điểm tương đồng
    sim_scores = sorted(range(len(sim_scores)), key=lambda i: sim_scores[i], reverse=True)

    # Lấy điểm tương đồng của 10 sản phẩm tương tự nhất
    sim_scores = sim_scores[1:11]

    # Lấy chỉ số của 10 sản phẩm tương tự nhất
    items_indices = sim_scores[1:11]
    
    # Trả về 10 sản phẩm tương tự nhất
    return list(set(new_data['Items'].iloc[items_indices]))

# Hàm gợi ý dựa trên sản phẩm (giữ lại cho backward compatibility)
def item_based(item_name, df):
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")
    item_name_col = user_item_df[item_name]
    moveis_from_item_based = user_item_df.corrwith(item_name_col).sort_values(ascending=False)
    mask = moveis_from_item_based.index != item_name
    moveis_from_item_based = moveis_from_item_based[mask]
    return moveis_from_item_based[0:10].index.to_list()

# Hàm dự đoán xếp hạng (giữ lại cho backward compatibility)
def predict_rating(random_user, df):
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")

    if random_user in user_item_df.index:
      random_user_df = user_item_df.loc[random_user]
      items_bought = random_user_df.index[random_user_df.notna()].tolist()
    else:
      items_bought = []
      
    items_bought_df = user_item_df[items_bought]
    user_item_count = items_bought_df.T.notnull().sum()

    user_item_count = user_item_count.reset_index()
    user_item_count.columns = ["User","item_count"]
    
    perc = len(items_bought) * 12 / 100

    users_same_items = user_item_count[user_item_count["item_count"] > perc]["User"]
    final_df = items_bought_df[items_bought_df.index.isin(users_same_items)]
    
    corr_df = final_df.T.corr().unstack().sort_values().drop_duplicates()
    corr_df = pd.DataFrame(corr_df)
    corr_df.columns = ["corr"]
    corr_df.index.names = ['user_1', 'user_2']
    corr_df = corr_df.reset_index()

    top_users = corr_df[(corr_df["user_1"] == random_user) & (corr_df["corr"] >= 0.3)][
        ["user_2", "corr"]].reset_index(drop=True)

    if not top_users.empty:
        top_users = top_users.sort_values(by='corr', ascending=False)
    else:
        top_users = pd.DataFrame(columns=["user_2", "corr"])
    top_users.rename(columns={"user_2": "User"}, inplace=True)
    top_users_ratings = top_users.merge(df[["User", "Items", "Rating"]], how='inner')
    top_users_ratings = top_users_ratings[top_users_ratings["User"] != random_user]

    top_users_ratings['weighted_rating'] = top_users_ratings['corr'] * top_users_ratings['Rating']
    top_users_ratings.groupby('Items').agg({"weighted_rating": "mean"})

    predict1 = pd.DataFrame()
    predict1['Items'] = top_users_ratings['Items']
    predict1['Rating'] = top_users_ratings['weighted_rating'] 
    return predict1
    
# Hàm lọc cộng tác (giữ lại cho backward compatibility)
def CollaborativeFiltering(item, user, df):
  recommendation_df = predict_rating(user, df)
  recommendation_df = recommendation_df.reset_index()

  filtered_df = recommendation_df[recommendation_df["Rating"] > 1]
  if not filtered_df.empty:
      items_to_be_recommend = filtered_df.sort_values("Rating", ascending=False)
  else:
      items_to_be_recommend = pd.DataFrame(columns=["Items", "Rating"])
 
  moveis_from_item_based = item_based(item, df)

  recommend_list = items_to_be_recommend[:10]['Items'].tolist() + moveis_from_item_based
  recommend_list = list(set(recommend_list))[:10]
  recommend_list = sorted(recommend_list, key=lambda x: random.random())
  return recommend_list

# Hàm gợi ý chính được cải thiện
def recommend(item, user, df, isLogin = False):
    # Khởi tạo hệ thống recommendation nâng cao
    rec_system = AdvancedRecommendationSystem(df)
    
    counts = df['User'].value_counts()
    
    if (not isLogin or user not in counts or counts[user] < 5):
        print("Using Hybrid Content-based + Item-based recommendations")
        # Sử dụng hybrid approach cho users chưa đăng nhập hoặc có ít dữ liệu
        recommend_list = rec_system.hybrid_recommendations(item, user, 10)
        
        # Fallback nếu không có đủ recommendations
        if len(recommend_list) < 5:
            content_recs = content_based(item, df)
            item_recs = item_based(item, df)
            recommend_list.extend(content_recs + item_recs)
            recommend_list = list(set(recommend_list))
        
        recommend_list = recommend_list[:10]
        return sorted(recommend_list, key=lambda x: random.random())
    else:
        print("Using Advanced Collaborative Filtering with User Behavior Analysis")
        # Sử dụng collaborative filtering nâng cao cho users đã đăng nhập
        return rec_system.hybrid_recommendations(item, user, 10)

# Hàm mới để lấy insights về hành vi người dùng
def get_user_insights(user, df):
    """Lấy insights về hành vi người dùng"""
    rec_system = AdvancedRecommendationSystem(df)
    return rec_system.get_user_behavior_insights(user)

# Test và demo
if __name__ == "__main__":
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path, 'data.csv')) 
    
    # Test với user có nhiều dữ liệu
    test_user = 'Adam'
    test_item = 'Toast'
    
    print("=== Testing Advanced Recommendation System ===")
    print(f"User: {test_user}")
    print(f"Item: {test_item}")
    
    # Test recommendations
    recommendations = recommend(test_item, test_user, df, True)
    print(f"Recommendations: {recommendations}")
    
    # Test user insights
    insights = get_user_insights(test_user, df)
    print(f"User Insights: {insights}")