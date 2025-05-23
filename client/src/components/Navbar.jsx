import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
  HiOutlineBars3,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHome,
  HiOutlineClipboard,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    regularUser,
    setRegularUser,
    navigate,
    setShowUserLogin,
    searchQuery,
    setSearchQuery,
    getCartItemCount,
    axios,
  } = useAppContext();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/user/logout", {});
      if (data.success) {
        toast.success(data.message);
        setRegularUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-10" src="/images/mirelogo.png" alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All products</NavLink>
        <NavLink to="/contact">contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <HiOutlineMagnifyingGlass className="w-6 h-6 opacity-90 cursor-pointer" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <HiOutlineShoppingCart className="w-6 h-6 opacity-80" />

          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartItemCount()}
          </button>
        </div>
        {!regularUser ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <HiOutlineUser className="w-10 h-10" />
            <ul className="hidden group-hover:block absolute top-8 right-0 bg-white shadow-md rounded-md w-40 text-sm text-gray-700 z-50">
              <li
                onClick={() => navigate("my-orders")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                My orders
              </li>
              <li
                onClick={() => handleLogout()}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src="/images/nav_cart_icon.svg" className="w-6 opacity-80" />

          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartItemCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className=""
        >
          <HiOutlineBars3 className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          <NavLink to="/" className="block" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="block"
          >
            All products
          </NavLink>
          {regularUser && (
            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
              className="block"
            >
              My orders
            </NavLink>
          )}
          <NavLink to="/contact">contact</NavLink>
          {!regularUser ? (
            <button
              onClick={(() => setOpen(false), setShowUserLogin(true))}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
