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
} from "recharts";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";

function Dashboard() {
  const { products } = useAppContext(); // Fetch products from context
  console.log("Products:", products);

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

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between p-4 md:p-10 space-y-5">
      <h1 className="text-lg font-medium flex items-center gap-2">
        
        Dashboard
      </h1>

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
      </div>

      {/* Bar Chart */}
      <div className="flex justify-center">
        <BarChart
          width={Math.min(window.innerWidth - 40, 900)} // Responsive width
          height={400}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Product Count" />
          <Bar dataKey="totalPrice" fill="#82ca9d" name="Total Price" />
        </BarChart>
      </div>
    </div>
  );
}

export default Dashboard;
