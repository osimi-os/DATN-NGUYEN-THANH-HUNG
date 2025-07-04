import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Report.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Component cho biểu đồ doanh thu theo tháng
const MonthlyRevenueChart = ({ data }) => (
  <div className="chart-section">
    <h2>Doanh Thu Theo Tháng</h2>
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Component cho biểu đồ doanh thu theo trạng thái
const RevenueByStatusChart = ({ data }) => (
  <div className="chart-section">
    <h2>Doanh Thu Theo Trạng Thái Đơn Hàng</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip
          formatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
        />
        <Bar dataKey="revenue" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Component cho biểu đồ top khách hàng
const TopCustomersChart = ({ data }) => (
  <div className="chart-section">
    <h2>Top 10 Khách Hàng Theo Doanh Thu</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip
          formatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
        />
        <Bar dataKey="revenue" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Component cho biểu đồ tròn đơn hàng theo trạng thái
const OrdersByStatusChart = ({ data }) => {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  return (
    <div className="chart-section">
      <h2>Phân Bố Đơn Hàng Theo Trạng Thái</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, percent }) =>
              `${status} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={150}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component cho biểu đồ đơn hàng theo ngày trong tuần
const OrdersByDayChart = ({ data }) => (
  <div className="chart-section">
    <h2>Đơn Hàng Theo Ngày Trong Tuần</h2>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Component cho filter và export
const ReportControls = ({ onExport, onFilterChange, filterValue }) => (
  <div className="report-controls">
    <div className="filter-section">
      <label htmlFor="timeFilter">Lọc theo thời gian:</label>
      <select
        id="timeFilter"
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        <option value="3">3 tháng gần nhất</option>
        <option value="6">6 tháng gần nhất</option>
        <option value="12">12 tháng gần nhất</option>
        <option value="24">24 tháng gần nhất</option>
        <option value="all">Tất cả</option>
      </select>
    </div>
    <button onClick={onExport} className="export-btn">
      Xuất Báo Cáo (PDF)
    </button>
  </div>
);

// Test component để debug
const TestConnection = ({ url }) => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/test`);
      setTestResult(response.data);
    } catch (error) {
      setTestResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f0f0f0",
        margin: "10px 0",
        borderRadius: "8px",
      }}
    >
      <h3>Test Connection</h3>
      <button onClick={testConnection} disabled={loading}>
        {loading ? "Testing..." : "Test API Connection"}
      </button>
      {testResult && (
        <pre
          style={{
            marginTop: "10px",
            background: "white",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {JSON.stringify(testResult, null, 2)}
        </pre>
      )}
    </div>
  );
};

const Report = ({ url }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("6");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        console.log("Fetching report data from:", `${url}/api/order/report`);
        const response = await axios.get(`${url}/api/order/report`);
        console.log("Response received:", response.data);
        if (response.data.success) {
          setReportData(response.data.data);
        } else {
          console.error("API returned success: false");
          setReportData(null);
        }
      } catch (err) {
        console.error("Error loading report data:", err);
        console.error("Error details:", err.response?.data || err.message);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [url, timeFilter]);

  const handleExport = () => {
    if (!reportData) return;

    // Tạo nội dung báo cáo
    const reportContent = `
BÁO CÁO TỔNG QUAN - YUMM! BAKERY
Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}

TỔNG QUAN:
- Tổng doanh thu: ${reportData.summary.totalRevenue.toLocaleString("vi-VN")} VNĐ
- Tổng đơn hàng: ${reportData.summary.totalOrders}
- Tổng khách hàng: ${reportData.summary.totalCustomers}
- Tỷ lệ thanh toán: ${reportData.summary.paymentRate}%
- Tỷ lệ đánh giá: ${reportData.summary.ratingRate}%

TOP KHÁCH HÀNG:
${reportData.topCustomers
  .map(
    (customer, index) =>
      `${index + 1}. ${customer.name}: ${customer.revenue.toLocaleString(
        "vi-VN"
      )} VNĐ`
  )
  .join("\n")}

DOANH THU THEO THÁNG:
${reportData.monthlyRevenue
  .map(
    (month) =>
      `${month.month}: ${month.revenue.toLocaleString("vi-VN")} VNĐ (${
        month.orders
      } đơn hàng)`
  )
  .join("\n")}
    `;

    // Tạo file và download
    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-yumm-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (value) => {
    setTimeFilter(value);
  };

  if (loading) {
    return (
      <div className="report-container">
        <TestConnection url={url} />
        <div className="loading">Đang tải dữ liệu báo cáo...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="report-container">
        <TestConnection url={url} />
        <div className="error">Không thể tải dữ liệu báo cáo</div>
      </div>
    );
  }

  const {
    summary,
    monthlyRevenue,
    revenueByStatus,
    topCustomers,
    ordersByStatus,
    ordersByDayOfWeek,
  } = reportData;

  return (
    <div className="report-container">
      <h1>Báo Cáo Tổng Quan</h1>

      {/* Controls */}
      <ReportControls
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        filterValue={timeFilter}
      />

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Tổng Doanh Thu</h3>
          <p className="amount">
            {summary.totalRevenue.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
        <div className="summary-card">
          <h3>Tổng Đơn Hàng</h3>
          <p className="amount">{summary.totalOrders}</p>
        </div>
        <div className="summary-card">
          <h3>Tổng Khách Hàng</h3>
          <p className="amount">{summary.totalCustomers}</p>
        </div>
        <div className="summary-card">
          <h3>Tỷ Lệ Thanh Toán</h3>
          <p className="amount">{summary.paymentRate}%</p>
        </div>
        <div className="summary-card">
          <h3>Tỷ Lệ Đánh Giá</h3>
          <p className="amount">{summary.ratingRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <MonthlyRevenueChart data={monthlyRevenue} />
      <RevenueByStatusChart data={revenueByStatus} />
      <TopCustomersChart data={topCustomers} />
      <OrdersByStatusChart data={ordersByStatus} />
      <OrdersByDayChart data={ordersByDayOfWeek} />

      {/* Thống kê chi tiết */}
      <div className="detailed-stats">
        <h2>Thống Kê Chi Tiết</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>Doanh Thu Trung Bình/Đơn</h4>
            <p>
              {(summary.totalRevenue / summary.totalOrders).toLocaleString(
                "vi-VN"
              )}{" "}
              VNĐ
            </p>
          </div>
          <div className="stat-item">
            <h4>Đơn Hàng Chưa Thanh Toán</h4>
            <p>
              {summary.totalOrders -
                Math.round((summary.totalOrders * summary.paymentRate) / 100)}
            </p>
          </div>
          <div className="stat-item">
            <h4>Đơn Hàng Chưa Đánh Giá</h4>
            <p>
              {summary.totalOrders -
                Math.round((summary.totalOrders * summary.ratingRate) / 100)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes
MonthlyRevenueChart.propTypes = {
  data: PropTypes.array.isRequired,
};

RevenueByStatusChart.propTypes = {
  data: PropTypes.array.isRequired,
};

TopCustomersChart.propTypes = {
  data: PropTypes.array.isRequired,
};

OrdersByStatusChart.propTypes = {
  data: PropTypes.array.isRequired,
};

OrdersByDayChart.propTypes = {
  data: PropTypes.array.isRequired,
};

ReportControls.propTypes = {
  onExport: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string.isRequired,
};

TestConnection.propTypes = {
  url: PropTypes.string.isRequired,
};

Report.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Report;
