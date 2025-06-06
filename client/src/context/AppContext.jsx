import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [regularUser, setRegularUser] = useState(null);
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (!storedCart || storedCart === "undefined") return {};
      return JSON.parse(storedCart);
    } catch {
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDeliveryMan, setLoadingDeliveryMan] = useState(true);

  const currency = import.meta.env.VITE_CURRENCY;

  //Fetch Admin status
  const fetchAdminStatus = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-Auth");
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
    setLoadingUser(true);
    try {
      const { data } = await axios.get("/api/user/is-Auth");
      if (data.success) {
        setRegularUser(data.user);
      } else {
        setRegularUser(null);
      }
    } catch (error) {
      console.log(error.message);
      setRegularUser(null);
    }
    setLoadingUser(false);
  };
  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
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
      const { data } = await axios.get("/api/user/categories");
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // fetch the current deliveryman
  const fetchCurrentDeliveryMan = async () => {
    setLoadingDeliveryMan(true);
    try {
      const { data } = await axios.get("/api/delivery-man/current");
      if (data.success) {
        setDeliveryMan(data.user);
        console.log("Fetched delivery man:", data.user);
      } else {
        setDeliveryMan(null);
      }
    } catch (error) {
      console.log(error.message);
      setDeliveryMan(null);
    }
    setLoadingDeliveryMan(false);
  };

  // Function to update a product in the global state
  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    toast.success("Product updated successfully!");
  };
  const deleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  //Fetch Top selling products from the database.
  const fetchAndMergeSoldCounts = async () => {
    try {
      // Fetch products first if not already loaded
      if (products.length === 0) {
        await fetchProducts();
      }
      // Fetch top sellers
      const { data } = await axios.get(
        "/api/public/orders-report?days=30"
      );
      let soldMap = {};
      if (data.success && data.report?.topProducts) {
        data.report.topProducts.forEach((tp) => {
          soldMap[tp.name] = tp.count;
        });
      }
      // Merge sold count into products
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          sold: soldMap[p.name] || 0,
        }))
      );
    } catch (err) {
      // If error, just set sold to 0 for all products
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          sold: 0,
        }))
      );
      console.error("Error fetching best sellers:", err);
    }
  };

  const fetchAllAuth = async () => {
    // Reset all roles
    setRegularUser(null);
    setIsAdmin(false);
    setDeliveryMan(null);

    // Check admin
    try {
      const { data } = await axios.get("/api/admin/is-Auth");
      if (data.success) setIsAdmin(true);
    } catch {}

    // Check delivery man
    try {
      const { data } = await axios.get("/api/delivery-man/current");
      if (data.success) setDeliveryMan(data.user);
    } catch {}

    // Check regular user
    try {
      const { data } = await axios.get("/api/user/is-Auth");
      if (data.success) setRegularUser(data.user);
    } catch {}
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchAdminStatus();
    fetchProducts();
    fetchCategories();
    fetchCurrentDeliveryMan();
    fetchUser();
    fetchAllAuth();
    fetchAndMergeSoldCounts();
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
    setCartItems,
    searchQuery,
    setSearchQuery,
    axios,
    getCartItemCount,
    getCartTotalAmount,
    fetchProducts,
    fetchCategories,
    fetchCurrentDeliveryMan,
    categories,
    setProducts,
    updateProduct,
    deleteProduct,
    loadingUser,
    setLoadingUser,
    loadingDeliveryMan,
    regularUser,
    setRegularUser,
    deliveryMan,
    setDeliveryMan,
    fetchAllAuth,
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
