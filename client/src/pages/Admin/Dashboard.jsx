import React from "react";
import { FaBox, FaTags, FaDollarSign } from "react-icons/fa"; // Import icons
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart, // <-- Add this
  Line,
} from "recharts";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { use } from "react";
import { useState } from "react";

const FILTER_OPTIONS = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
];

function Dashboard() {
  const { products, axios } = useAppContext();
  const [days, setDays] = useState(7);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("Products:", products);

  // Fetch report when filter changes
  const fetchReport = async () => {
    try {
      const { data } = await axios.get(
        `/api/order/admin/orders-report?days=${days}`
      );
      if (data.success) {
        setReport(data.report);
        // Log all user names from recent orders
        if (data.report?.recentOrders) {
          console.log(
            "Recent order users:",
            data.report.recentOrders.map((order) => order.email)
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching report:", error);
    }
  };

  // Group products by category and calculate total count
  const groupedData = products.reduce((acc, product) => {
    const existingCategory = acc.find(
      (item) => item.category === product.category
    );
    if (existingCategory) {
      existingCategory.count += 1; // Increment count for the category
      existingCategory.totalPrice += product.price; // Add product price to total
    } else {
      acc.push({
        category: product.category,
        count: 1,
        totalPrice: product.price,
      });
    }
    return acc;
  }, []);

  // Prepare data for the chart
  const chartData = groupedData.map((item) => ({
    name: item.category,
    count: item.count,
    totalPrice: item.totalPrice,
  }));

  // Calculate summary metrics
  const totalProducts = products.length;
  const totalCategories = groupedData.length;
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.price,
    0
  );

  useEffect(() => {
    fetchReport();
  }, [days]);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between p-4 md:p-10 space-y-5">
      <h1 className="text-lg font-medium flex items-center gap-2">Dashboard</h1>
      {/* Filter */}
      <div className="mb-6 flex justify-end gap-2 ">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded ${
              days === opt.value ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setDays(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <HiOutlineCube className="text-blue-500 text-3xl" />
          <div>
            <h2 className="text-xl font-bold">{totalProducts}</h2>
            <p className="text-gray-600">Total Products</p>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <HiOutlineTag className="text-green-500 text-3xl" />
          <div>
            <h2 className="text-xl font-bold">{totalCategories}</h2>
            <p className="text-gray-600">Total Categories</p>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <HiOutlineCurrencyDollar className="text-yellow-500 text-3xl" />
          <div>
            <h2 className="text-xl font-bold">${totalStockValue.toFixed(2)}</h2>
            <p className="text-gray-600">Total Stock Value</p>
          </div>
        </div>
        {report && (
          <div className="bg-purple-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
            <FaBox className="text-purple-500 text-3xl" />
            <div>
              <h2 className="text-xl font-bold">{report.totalOrders}</h2>
              <p className="text-gray-600">
                Orders ({FILTER_OPTIONS.find((f) => f.value === days).label})
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Order/Revenue Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold">
              ${report.totalRevenue?.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-500">Delivered Orders</div>
            <div className="text-2xl font-bold">{report.deliveredOrders}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-500">Pending Orders</div>
            <div className="text-2xl font-bold">{report.pendingOrders}</div>
          </div>
        </div>
      )}
      {/* Trends/Charts */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold mb-2">Orders Per Day</h3>
            <LineChart width={400} height={250} data={report.ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                name="Orders"
              />
            </LineChart>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Revenue Per Day</h3>
            <LineChart width={400} height={250} data={report.revenuePerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Revenue"
              />
            </LineChart>
          </div>
        </div>
      )}
      {/* Top Products */}
      {report && (
        <div className="mt-8 flex flex-col md:flex-row gap-8 items-stretch">
          {/* Pie Chart */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-white rounded-lg shadow p-4">
            <PieChart width={220} height={220}>
              <Pie
                data={report.topProducts}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
              >
                {report.topProducts.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][
                        idx % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            {/* Custom Legend */}
            <ul className="mt-4 space-y-2 w-full">
              {report.topProducts.map((p, idx) => (
                <li key={p.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        "#8884d8",
                        "#82ca9d",
                        "#ffc658",
                        "#ff8042",
                        "#a4de6c",
                      ][idx % 5],
                    }}
                  ></span>
                  <span className="truncate">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-200 mx-2"></div>
          {/* Product List */}
          <div className="w-full md:w-2/3">
            <h3 className="font-semibold mb-4 text-lg">Top Selling Products</h3>
            <ul className="space-y-3">
              {report.topProducts.map((p, idx) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "#8884d8",
                          "#82ca9d",
                          "#ffc658",
                          "#ff8042",
                          "#a4de6c",
                        ][idx % 5],
                      }}
                    ></span>
                    <span className="font-medium truncate max-w-[120px] md:max-w-[200px]">
                      {p.name}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {p.count} sold
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Recent Orders Table */}

      {/* Recent Orders Table */}
      {report && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left w-24">Sr. No.</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {report.recentOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{order.email}</td>
                    <td className="px-4 py-2 font-semibold text-green-700">
                      ${Number(order.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
