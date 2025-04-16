import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Home from "./src/pages/Home";
import AllProducts from "./src/pages/AllProducts";
import { Toaster } from "react-hot-toast";
import Footer from "./src/components/Footer";
import { useAppContext } from "./src/context/AppContext";
import Login from "./src/components/Login";

function App() {
  const isSellerPath = useLocation().pathname.includes("/seller");
  const { showUserLogin } = useAppContext();
  return (
    <>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-16 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </>
  );
}
export default App;
