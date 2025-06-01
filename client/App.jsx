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
import ProductDetails from "./src/pages/ProductDetails";
import AddProduct from "./src/pages/Admin/AddProduct";
import Cart from "./src/pages/Cart";
import AddAddress from "./src/pages/AddAddress";
import MyOrders from "./src/pages/MyOrders";
import ProductList from "./src/pages/Admin/ProductList";
import Orders from "./src/pages/Admin/Orders";
import AddNewCategory from "./src/pages/Admin/AddNewCategory";
import InStock from "./src/pages/Admin/InStock";
import Dashboard from "./src/pages/Admin/Dashboard";
import OutStock from "./src/pages/Admin/OutStock";
import Loading from "./src/components/Loading";
import ProductManagement from "./src/pages/Admin/ProductManagement";
import CreateDeliveryMan from "./src/pages/Admin/CreateDeliveryMan";
import DeliveryMenList from "./src/pages/Admin/DeliveryMenList";
import DeliveryManLogin from "./src/pages/DeliveryManLogin";
import DeliveryDashboard from "./src/pages/DeliveryDashboard";
import ProtectedDeliveryManRoute from "./src/components/ProtectedDeliveryManRoute";
import DeliveryManProvider from "./src/context/DeliveryManContext";
import OrdersByStatus from "./src/pages/Admin/OrdersByStatus";
import OrdersByStatusSelector from "./src/pages/Admin/OrdersByStatusSelector";
import ContactUs from "./src/components/ContactUs";

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");
  const isDeliveryManLogin = location.pathname === "/delivery-man/login";
  const isDeliveryManDashboard = location.pathname.startsWith(
    "/delivery-man/dashboard"
  );
  const { showUserLogin, isAdmin } = useAppContext();
  return (
    <div className="text-default min-h-screen text=gray-700 bg-white">
      {isAdminPath || isDeliveryManLogin || isDeliveryManDashboard ? null : (
        <Navbar />
      )}
      {showUserLogin && <Login />}
      <Toaster />
      <div
        className={`${
          isAdminPath || isDeliveryManLogin
            ? ""
            : "px-6 md:px-16 lg:px-16 xl:px-32"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/contact" element={<ContactUs />} />
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
            <Route path="create-delivery-man" element={<CreateDeliveryMan />} />
            <Route path="delivery-men" element={<DeliveryMenList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="OrdersByStatus" element={<OrdersByStatusSelector />} />
            <Route path="OrdersByStatus/:status" element={<OrdersByStatus />} />
            <Route path="product-management" element={<ProductManagement />} />
          </Route>

          <Route path="/delivery-man/login" element={<DeliveryManLogin />} />
          <Route
            path="/delivery-man/dashboard"
            element={
              <ProtectedDeliveryManRoute>
                <DeliveryDashboard />
              </ProtectedDeliveryManRoute>
            }
          />

          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>
      {!isAdminPath && !isDeliveryManLogin && <Footer />}
    </div>
  );
}
export default App;
