import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [zoneDeliveryMen, setZoneDeliveryMen] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState({});

  const { axios } = useAppContext();
  const navigate = useNavigate(); // Initialize navigate

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/admin");
      if (data.success) {
        setOrders(data.orders);
        console.log(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch delivery men for a specifi zone
  

  const redirectToAssignDeliveryMan = (orderId) => {
    navigate(`/admin/delivery-men?orderId=${orderId}`); // Redirect with orderId
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    if (filter === "Assigned") return !!order.assignedTo;
    if (filter === "Unassigned") return !order.assignedTo;
    return true;
  });
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Orders List</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${
                filter === "All" ? "bg-primary text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded ${
                filter === "Unassigned"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilter("Unassigned")}
            >
              Unassigned
            </button>
            <button
              className={`px-3 py-1 rounded ${
                filter === "Assigned" ? "bg-primary text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("Assigned")}
            >
              Assigned
            </button>
          </div>
        </div>
        {filteredOrders
          .slice()
          .sort((a, b) => {
            //unassigned orders first
            if (!a.assignedTo && b.assignedTo) return -1;
            if (a.assignedTo && !b.assignedTo) return 1;
            return 0;
          })
          .map((order, index) => (
            <div
              key={index}
              className="relative flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
            >
              {/* Zone Display */}
              <div className="absolute top-2 left-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                <HiOutlineTruck className="inline w-4 h-4 mr-1" />
                Zone: {order.zone || "Unknown"}
              </div>
              <div className="flex gap-5 max-w-80">
                <img
                  className="w-12 h-12 object-cover"
                  src={order.items[0].product.image[0]}
                  alt="boxIcon"
                />
                <div>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <p className="font-medium">
                        {item.product.name}{" "}
                        <span className="text-primary">x {item.quantity}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.address ? (
                <div className="text-sm md:text-base text-black/60">
                  <p className="text-black/80 ">
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.country}
                  </p>
                  <p>{order.address.phone}</p>
                </div>
              ) : (
                <div className="text-sm md:text-base text-black/60">
                  <p className="text-red-500">Address information is missing</p>
                </div>
              )}

              <p className="font-medium text-lg my-auto">${order.amount}</p>

              <div className="flex flex-col text-sm md:text-base text-black/60">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                  Payment:{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      order.isPaid
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.isPaid === true ? "Paid" : "Pending"}
                  </span>
                </p>
                <p>
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>

              {/* Redirect to Assign Delivery Man */}
              <div className="flex flex-col gap-2">
                {!order.assignedTo ? (
                  <button
                    className="flex items-center justify-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 min-w-[120px]"
                    onClick={() => redirectToAssignDeliveryMan(order._id)}
                  >
                    <HiOutlineUserPlus className="w-4 h-4" />
                    <span>Assign</span>
                  </button>
                ) : (
                  <span className="flex items-center justify-center gap-2 bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-md min-w-[120px]">
                    <HiOutlineUser className="w-4 h-4" />
                    <span>Assigned</span>
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Orders;
