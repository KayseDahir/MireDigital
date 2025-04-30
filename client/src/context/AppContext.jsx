import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  const currency = import.meta.env.VITE_CURRENCY;

  //Fetch Admin status
  const fetchAdminStatus = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/admin/is-Auth",
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
      console.log(error.message);
    }
  };

  // Fetch User
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/user/is-Auth",
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/product/list",
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // Add to cart
  const addToCart = (productId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] += 1;
      } else {
        newCart[productId] = 1;
      }
      return newCart;
    });
    toast.success(`added to cart`);
  };

  //Update cart quantity
  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] = quantity;
      } else {
        newCart[productId] = 1;
      }
      return newCart;
    });
    toast.success(`Cart quantity updated`);
  };

  //Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] -= 1;
      }
      if (newCart[productId] === 0) {
        delete newCart[productId];
      }
      if (Object.keys(newCart).length === 0) {
        setCartItems({});
      }
      return newCart;
    });
    toast.success(`Product removed from cart`);
  };

  // Get Cart Item count
  const getCartItemCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get Cart Total Amount
  const getCartTotalAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Fetch All Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/user/categories",
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAdminStatus();
    fetchProducts();
    fetchCategories();
  }, []);
  const value = {
    user,
    setUser,
    fetchUser,
    isAdmin,
    setIsAdmin,
    fetchAdminStatus,
    navigate,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    axios,
    getCartItemCount,
    getCartTotalAmount,
    fetchProducts,
    fetchCategories,
    categories,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
export { AppProvider, useAppContext };
