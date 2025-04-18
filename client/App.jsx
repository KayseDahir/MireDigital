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
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          ></Route>
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
}
export default App;
