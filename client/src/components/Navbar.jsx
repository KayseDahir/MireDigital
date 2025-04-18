import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser, navigate, setShowUserLogin, axios } = useAppContext();

  console.log("User state in Navbar:", user);
  const handleLogout = async () => {
    // try {
    //   const { data } = await axios.get("")
    // } catch (error) {
    //   console.log(error.message);
    // }
    setUser(null);
    navigate("/");
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-10" src="../images/mirelogo.png" alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All products</NavLink>
        <NavLink to="/contact">contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img
            src="/images/search_icon.svg"
            alt="search"
            className="w-6 h-6 opacity-90 cursor-pointer"
          />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src="/images/nav_cart_icon.svg" />

          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            3
          </button>
        </div>
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src="/images/profile_icon.png"  className="w-10"/>
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

      <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label="Menu"
        className="sm:hidden"
      >
        {/* Menu Icon SVG */}
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

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
          {user && (
            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
              className="block"
            >
              My orders
            </NavLink>
          )}
          <NavLink to="/contact">contact</NavLink>
          {!user ? (
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
