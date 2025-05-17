import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineCube,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
// ...existing code...
import { useAppContext } from "../context/AppContext";

const DeliveryManNavbar = () => {
  const { deliveryMan, setDeliveryMan, navigate } = useAppContext();

  const handleLogout = () => {
    setDeliveryMan(null);
    navigate("/delivery-man/login");
  };

  return (
    <nav className="bg-primary text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link to="/delivery-man/dashboard">Delivery Dashboard</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/delivery-man/dashboard" className="hover:underline">
          My Orders
        </Link>
        {/* Add more links as needed */}
        <span className="flex items-center gap-1">
          <HiOutlineUser className="inline text-lg" />
          {deliveryMan?.name}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-200"
        >
          <HiOutlineArrowRightOnRectangle className="inline text-lg" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DeliveryManNavbar;
