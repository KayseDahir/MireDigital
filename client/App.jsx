import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Home from "./src/pages/Home";
import AllProducts from "./src/pages/AllProducts";
import { Toaster } from "react-hot-toast";
import Footer from "./src/components/Footer";
import { useAppContext } from "./src/context/AppContext";
import Login from "./src/components/Login";
import AdminLogin from "./src/components/Admin/AdminLogin";
import AdminLayout from "./src/pages/Admin/Layout";
import ProductCategory from "./src/pages/ProductCategory";
import ProductDetails from "./src/pages/productDetails";
import AddProduct from "./src/pages/Admin/AddProduct";
import Cart from "./src/pages/Cart";
import AddAddress from "./src/pages/AddAddress";
import MyOrders from "./src/pages/MyOrders";
import ProductList from "./src/pages/Admin/ProductList";
import Orders from "./src/pages/Admin/Orders";
import AddNewCategory from "./src/pages/Admin/AddNewCategory";
import InStock from "./src/pages/Admin/InStock";
import Dashboard from "./src/pages/Admin/dashboard";
import OutStock from "./src/pages/Admin/OutStock";
import Loading from "./src/components/Loading";
import ProductManagement from "./src/pages/Admin/ProductManagement";

function App() {
  const isAdminPath = useLocation().pathname.includes("/admin");
  const { showUserLogin, isAdmin } = useAppContext();
  return (
    <div className="text-default min-h-screen text=gray-700 bg-white">
      {isAdminPath ? null : <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div
        className={`${isAdminPath ? "" : "px-6 md:px-16 lg:px-16 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/loader" element={<Loading />} />

          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path="/admin/add-category" element={<AddNewCategory />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inStock" element={<InStock />} />
            <Route path="outStock" element={<OutStock />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product-management" element={<ProductManagement />} />
          </Route>

          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-adress" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
}
export default App;
