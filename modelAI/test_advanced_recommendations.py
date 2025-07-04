#!/usr/bin/env python3
"""
Script test cho hệ thống recommendation nâng cao
Kiểm tra các thuật toán khác nhau và so sánh kết quả
"""

import requests
import json
import time
from recommend import AdvancedRecommendationSystem
import pandas as pd
import os

def test_ai_api():
    """Test các API của AI service"""
    base_url = "http://localhost:8000"
    
    print("=== Testing AI Recommendation APIs ===")
    
    # Test 1: Basic recommendation
    print("\n1. Testing basic recommendation...")
    try:
        response = requests.get(f"{base_url}/recommend/?item_name=Toast&user_name=Adam")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {len(data['recommendations'])} recommendations")
            print(f"   Algorithm: {data['algorithm']}")
            print(f"   Sample recommendations: {data['recommendations'][:3]}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 2: User insights
    print("\n2. Testing user insights...")
    try:
        response = requests.get(f"{base_url}/user-insights/?user_name=Adam")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: User insights retrieved")
            if data['insights']:
                print(f"   Total ratings: {data['insights'].get('total_ratings', 'N/A')}")
                print(f"   Average rating: {data['insights'].get('avg_rating', 'N/A'):.2f}")
            else:
                print("   No insights available")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 3: Content-based filtering
    print("\n3. Testing content-based filtering...")
    try:
        response = requests.get(f"{base_url}/content-based/?item_name=Coffee&n_recommendations=5")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data['count']} content-based recommendations")
            print(f"   Algorithm: {data['algorithm']}")
            print(f"   Recommendations: {data['recommendations']}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 4: Collaborative filtering
    print("\n4. Testing collaborative filtering...")
    try:
        response = requests.get(f"{base_url}/collaborative/?user_name=Adam&n_recommendations=5")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data['count']} collaborative recommendations")
            print(f"   Algorithm: {data['algorithm']}")
            print(f"   Recommendations: {data['recommendations']}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 5: Matrix factorization
    print("\n5. Testing matrix factorization...")
    try:
        response = requests.get(f"{base_url}/matrix-factorization/?user_name=Adam&n_recommendations=5")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data['count']} matrix factorization recommendations")
            print(f"   Algorithm: {data['algorithm']}")
            print(f"   Recommendations: {data['recommendations']}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 6: Algorithm comparison
    print("\n6. Testing algorithm comparison...")
    try:
        response = requests.get(f"{base_url}/compare-algorithms/?item_name=Toast&user_name=Adam")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Algorithm comparison completed")
            for algo, recs in data['algorithms'].items():
                print(f"   {algo}: {len(recs)} recommendations")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    # Test 7: System statistics
    print("\n7. Testing system statistics...")
    try:
        response = requests.get(f"{base_url}/system-stats/")
        if response.status_code == 200:
            data = response.json()
            stats = data['statistics']
            print(f"✅ Success: System statistics retrieved")
            print(f"   Total records: {stats['total_records']}")
            print(f"   Unique users: {stats['unique_users']}")
            print(f"   Unique items: {stats['unique_items']}")
            print(f"   Average rating: {stats['avg_rating']:.2f}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_offline_recommendations():
    """Test hệ thống recommendation offline"""
    print("\n=== Testing Offline Recommendation System ===")
    
    # Load data
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path, 'data.csv'))
    
    # Khởi tạo hệ thống recommendation
    print("Initializing Advanced Recommendation System...")
    rec_system = AdvancedRecommendationSystem(df)
    
    # Test với các users khác nhau
    test_cases = [
        ("Toast", "Adam", True),      # User có nhiều dữ liệu
        ("Coffee", "Isabella", True), # User có nhiều dữ liệu nhất
        ("Bread", "anonymous", False), # User chưa đăng nhập
        ("Cake", "NewUser", True),    # User mới
    ]
    
    for item, user, is_login in test_cases:
        print(f"\n--- Testing: Item={item}, User={user}, Login={is_login} ---")
        
        # Test hybrid recommendations
        try:
            hybrid_recs = rec_system.hybrid_recommendations(item, user, 5)
            print(f"Hybrid recommendations: {hybrid_recs}")
        except Exception as e:
            print(f"Hybrid recommendations error: {e}")
        
        # Test content-based
        try:
            content_recs = rec_system.content_based_recommendations(item, 5)
            print(f"Content-based recommendations: {content_recs}")
        except Exception as e:
            print(f"Content-based error: {e}")
        
        # Test collaborative filtering nếu user đã đăng nhập
        if is_login and user != "anonymous":
            try:
                collab_recs = rec_system.collaborative_filtering_recommendations(user, 5)
                print(f"Collaborative recommendations: {collab_recs}")
            except Exception as e:
                print(f"Collaborative filtering error: {e}")
            
            try:
                mf_recs = rec_system.matrix_factorization_recommendations(user, 5)
                print(f"Matrix factorization recommendations: {mf_recs}")
            except Exception as e:
                print(f"Matrix factorization error: {e}")
        
        # Test user insights nếu user đã đăng nhập
        if is_login and user != "anonymous":
            try:
                insights = rec_system.get_user_behavior_insights(user)
                if insights:
                    print(f"User insights: {insights.get('total_ratings', 0)} ratings, "
                          f"avg rating: {insights.get('avg_rating', 0):.2f}")
                else:
                    print("No user insights available")
            except Exception as e:
                print(f"User insights error: {e}")

def performance_test():
    """Test hiệu suất của hệ thống"""
    print("\n=== Performance Testing ===")
    
    # Load data
    cd = os.getcwd()
    data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
    df = pd.read_csv(os.path.join(data_path, 'data.csv'))
    
    # Khởi tạo hệ thống
    start_time = time.time()
    rec_system = AdvancedRecommendationSystem(df)
    init_time = time.time() - start_time
    print(f"System initialization time: {init_time:.2f} seconds")
    
    # Test recommendation speed
    test_items = ["Toast", "Coffee", "Bread", "Cake", "Tea"]
    test_users = ["Adam", "Isabella", "anonymous"]
    
    total_time = 0
    total_recommendations = 0
    
    for item in test_items:
        for user in test_users:
            start_time = time.time()
            try:
                recs = rec_system.hybrid_recommendations(item, user, 10)
                end_time = time.time()
                total_time += (end_time - start_time)
                total_recommendations += 1
                print(f"Recommendation for {item} + {user}: {len(recs)} items in {end_time - start_time:.3f}s")
            except Exception as e:
                print(f"Error with {item} + {user}: {e}")
    
    avg_time = total_time / total_recommendations if total_recommendations > 0 else 0
    print(f"\nPerformance Summary:")
    print(f"Total recommendations: {total_recommendations}")
    print(f"Average time per recommendation: {avg_time:.3f} seconds")
    print(f"Recommendations per second: {1/avg_time:.1f}" if avg_time > 0 else "N/A")

if __name__ == "__main__":
    print("🚀 Advanced Recommendation System Testing")
    print("=" * 50)
    
    # Test offline system trước
    test_offline_recommendations()
    
    # Test performance
    performance_test()
    
    # Test API (nếu server đang chạy)
    print("\n" + "=" * 50)
    print("Testing API endpoints (make sure server is running with: uvicorn main:app --reload)")
    test_ai_api()
    
    print("\n✅ Testing completed!") 