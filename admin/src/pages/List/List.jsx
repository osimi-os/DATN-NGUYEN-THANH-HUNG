import React, { useEffect, useState, useCallback } from "react";
import "./List.css";
import { toast } from "react-toastify";
import axios from "axios";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchList = useCallback(
    async (page = 1, search = "", category = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
        });

        if (search) params.append("search", search);
        if (category && category !== "") params.append("category", category);

        // Sử dụng API list-all cho admin để lấy tất cả dữ liệu
        const response = await axios.get(`${url}/api/food/list-all`);

        if (response.data.success) {
          // Filter dữ liệu ở client side cho admin
          let filteredData = response.data.data;

          if (search) {
            filteredData = filteredData.filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            );
          }

          if (category && category !== "") {
            filteredData = filteredData.filter(
              (item) => item.category === category
            );
          }

          // Pagination ở client side
          const startIndex = (page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          const paginatedData = filteredData.slice(startIndex, endIndex);

          setList(paginatedData);
          setPagination({
            ...pagination,
            page,
            total: filteredData.length,
            pages: Math.ceil(filteredData.length / pagination.limit),
          });
        } else {
          toast.error("Lỗi khi tải danh sách món");
        }
      } catch (error) {
        console.error("Error fetching list:", error);
        toast.error("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    },
    [url, pagination.limit]
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/food/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success("Đã xóa món thành công");
        fetchList(pagination.page, searchTerm, selectedCategory);
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Lỗi khi xóa món");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${url}/api/food/update/${editingItem._id}`,
        editingItem
      );

      if (response.data.success) {
        toast.success("Đã cập nhật");
        setEditingItem(null);
        fetchList(pagination.page, searchTerm, selectedCategory);
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  // Debounced search
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchList(1, value, selectedCategory);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchList(1, searchTerm, category);
  };

  const handlePageChange = (newPage) => {
    fetchList(newPage, searchTerm, selectedCategory);
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, [fetchList]);

  return (
    <div className="list add flex-col">
      <p className="title-list">All Foods List</p>

      {/* Thanh tìm kiếm & chọn loại */}
      <div className="list-filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Table */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Description</b>
          <b>Action</b>
        </div>

        {!loading &&
          list.map((item, index) => (
            <div key={index} className="list-table-format list-row">
              <img
                className="food-img"
                src={`${url}/images/${item.image}`}
                alt={item.name}
                loading="lazy"
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{parseInt(item.price).toLocaleString("vi-VN")}₫</p>
              <p>{item.description?.slice(0, 30) || ""}</p>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => removeFood(item._id)}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}({pagination.total}{" "}
            items)
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Food</h3>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              type="text"
              value={editingItem.category}
              onChange={(e) =>
                setEditingItem({ ...editingItem, category: e.target.value })
              }
              placeholder="Category"
            />
            <input
              type="number"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({ ...editingItem, price: e.target.value })
              }
              placeholder="Price"
            />
            <textarea
              rows={3}
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              placeholder="Description"
            />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
