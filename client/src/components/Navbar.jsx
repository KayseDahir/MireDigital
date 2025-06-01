import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
  HiOutlineBars3,
  HiOutlineUserCircle,
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
    showUserLogin,
  } = useAppContext();
  const [testEmail, setTestEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [showTestLoginModal, setShowTestLoginModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const testUnifiedLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/unified-login", {
        email: testEmail,
        password: testPassword,
      });
      if (data.success) {
        toast.success(`Unified: ${data.message}`);
        // Redirect based on role
        const role = data.user.role || "user";
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "deliveryMan") {
          navigate("/delivery-man/dashboard");
        } else {
          setRegularUser(data.user);
          navigate("/");
        }
        setShowUserLogin(false);
        setShowTestLoginModal(false);
        setTestEmail("");
        setTestPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
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

  const handleForgotSubmit = async () => {
    try {
      await axios.post("/api/user/send-reset-otp", { email: forgotEmail });
      setForgotStep(2);
      setResendTimer(60);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };
  const handleResetPassword = async () => {
    try {
      await axios.post("/api/user/reset-password", {
        email: forgotEmail,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully.");
      setShowForgot(false);
      setForgotStep(1);
      setForgotEmail("");
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };
  useEffect(() => {
    let timer;
    if (forgotStep === 2 && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotStep, resendTimer]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  // Close the modal when clicking outside of it
  useEffect(() => {
    if (showUserLogin || showTestLoginModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showUserLogin, showTestLoginModal]);
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

        {showTestLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="bg-white rounded-lg shadow-xl p-8 py-12 w-80 sm:w-[352px] relative border border-gray-200 flex flex-col items-start transition-all duration-300">
              <button
                onClick={() => setShowTestLoginModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="relative w-full min-h-[260px]">
                {/* Login Form */}
                <div
                  className={`${
                    showForgot ? "hidden" : "block"
                  } transition-all duration-300`}
                >
                  <p className="text-2xl font-medium m-auto w-full text-center mb-4">
                    <span className="text-primary">User</span> Login
                  </p>
                  <form
                    className="flex flex-col gap-4 w-full"
                    onSubmit={testUnifiedLogin}
                  >
                    <div className="w-full">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="Email"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary text-sm"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="password"
                        value={testPassword}
                        onChange={(e) => setTestPassword(e.target.value)}
                        placeholder="Password"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary text-sm"
                        required
                      />
                    </div>
                    <div className="w-full text-right mt-1">
                      <button
                        type="button"
                        className="text-primary underline text-xs"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="bg-primary transition-all text-white w-full py-2 rounded-md cursor-pointer"
                    >
                      Login
                    </button>
                  </form>
                </div>
                {/* Forgot Password Form */}
                <div
                  className={`${
                    showForgot ? "block" : "hidden"
                  } transition-all duration-300`}
                >
                  {forgotStep === 1 && (
                    <>
                      <p className="text-xl font-semibold mb-2 text-center">
                        Forgot your password?
                      </p>
                      <p className="mb-4 text-center text-gray-600 text-sm">
                        Please enter your email to receive an OTP.
                      </p>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Email"
                        className="border border-gray-200 rounded w-full p-2 mb-4 outline-primary text-sm"
                        required
                      />
                      <div className="flex justify-between w-full gap-2">
                        <button
                          type="button"
                          className="w-1/2 py-2 rounded-md border border-gray-300 text-gray-700"
                          onClick={() => {
                            setShowForgot(false);
                            setForgotStep(1);
                            setForgotEmail("");
                          }}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="w-1/2 py-2 rounded-md bg-primary text-white"
                          onClick={handleForgotSubmit}
                          disabled={!forgotEmail}
                        >
                          Send OTP
                        </button>
                      </div>
                    </>
                  )}
                  {forgotStep === 2 && (
                    <>
                      <p className="text-xl font-semibold mb-2 text-center">
                        Verify your identity
                      </p>
                      <p className="mb-2 text-center text-gray-600 text-sm">
                        Please enter the OTP sent to{" "}
                        <span className="font-semibold">{forgotEmail}</span> to
                        continue
                      </p>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="border border-gray-200 rounded w-full p-2 mb-2 outline-primary text-sm"
                        required
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="border border-gray-200 rounded w-full p-2 mb-4 outline-primary text-sm"
                        required
                      />
                      <div className="flex justify-between w-full gap-2">
                        <button
                          type="button"
                          className="w-1/2 py-2 rounded-md border border-gray-300 text-gray-700"
                          onClick={() => setShowForgot(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="w-1/2 py-2 rounded-md bg-primary text-white"
                          onClick={handleResetPassword}
                          disabled={!otp || !newPassword}
                        >
                          Confirm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {!regularUser ? (
          <>
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full"
            >
              Signup
            </button>
            <button
              onClick={() => setShowTestLoginModal(true)}
              className="cursor-pointer px-8 py-2 bg-primary transition text-white rounded-full"
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative group">
            <img
              src="/images/profile_icon.png" // Update this path to your actual icon file
              alt="User"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-200"
            />
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
            <>
              <button
                onClick={(() => setOpen(false), setShowUserLogin(true))}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm"
              >
                Login
              </button>{" "}
              <button
                onClick={() => setShowUserLogin(true)}
                className="cursor-pointer px-8 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-full ml-2"
              >
                Test Unified Login
              </button>
            </>
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
