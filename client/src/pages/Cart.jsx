import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import EmptyCart from "../components/EmptyCart";

function Cart() {
  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [payementOption, setPayementOption] = useState("COD");

  const {
    products,
    cartItems,
    setCartItems,
    removeFromCart,
    getCartItemCount,
    getCartTotalAmount,
    navigate,
    axios,
    regularUser,
  } = useAppContext();
  console.log("navigate in Cart:", navigate, typeof navigate);
  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({
          ...product,
          cartQuantity: cartItems[key], // use cartQuantity for the cart
        });
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch addresses. Please try again.");
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (regularUser) {
      getUserAddress();
    }
  }, [regularUser]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select a delivery address.");
        return;
      }
      if (payementOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: regularUser._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.cartQuantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        // place order with stripe
        const { data } = await axios.post("/api/order/online", {
          userId: regularUser._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.cartQuantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          window.location.replace(data.url);
          setCartItems({});
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!products || products.length === 0) {
    return <p>Loading products...</p>;
  }

  if (!cartItems || Object.keys(cartItems).length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 ">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {getCartItemCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      value={cartItems[product._id]}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        setCartItems((prevCartItems) => ({
                          ...prevCartItems,
                          [product._id]: newQuantity,
                        }));
                        getCart();
                        toast.success("Cart updated.");
                      }}
                      className="outline-none"
                    >
                      {Array.from(
                        { length: product.quantity }, // product.quantity is now the available stock
                        (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              ${product.offerPrice * product.cartQuantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src="/icons/remove_icon.svg"
                alt="remove"
                className="inline-bock w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
          onClick={() => navigate("/products")}
        >
          <img
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="group-hover:-translate-x-1 transition"
            src="/icons/arrow_right_icon_colored.svg"
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    onClick={() => {
                      setShowAddress(false);
                      setSelectedAddress(address);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {`${address.street}, ${address.city}, ${address.state}, ${address.country}`}
                  </p>
                ))}
                <p
                  onClick={() => {
                    console.log("Add address clicked");
                    navigate("/add-address");
                  }}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPayementOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>${getCartTotalAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>${(getCartTotalAmount() * 2) / 100}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              ${getCartTotalAmount() + (getCartTotalAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          {payementOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}
export default Cart;
