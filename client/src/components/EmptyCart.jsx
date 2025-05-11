import { useAppContext } from "../context/AppContext";

const EmptyCart = () => {
  const { navigate } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-600">
      <img
        src="/images/Shopping_cart.png"
        alt="Empty Cart"
        className="w-36 h-36 mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
      <p className="text-lg mb-4">
        Looks like you haven’t added anything to your cart yet.
      </p>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={()=> navigate("/products")}
      >
        Shop Now
      </button>
    </div>
  );
};

export default EmptyCart;
