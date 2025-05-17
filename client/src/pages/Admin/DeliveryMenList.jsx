import { useEffect, useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineTruck,
  HiOutlineUserPlus,
  HiOutlineCreditCard,
  HiOutlineMapPin, // ✅ Use this for location
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams

const DeliveryMenList = () => {
  const { axios, navigate } = useAppContext();
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [searchParams] = useSearchParams(); // Initialize searchParams
  const orderId = searchParams.get("orderId"); // Get orderId from query params

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/delivery-men",
          { withCredentials: true }
        );
        if (data.success) {
          setDeliveryMen(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/order/admin/orders/${orderId}`,
          { withCredentials: true }
        );
        if (data.success) setOrder(data.data);
        else toast.error(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch order");
      }
    };
    const fetchAllOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/order/admin/orders",
          { withCredentials: true }
        );
        if (data.success) setAllOrders(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch orders");
      }
    };
    fetchDeliveryMen();
    fetchAllOrders();
    if (orderId) fetchOrder();
  }, [orderId, axios]);

  const assignDeliveryMan = async (deliveryManId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/admin/assign-order",
        { orderId, deliveryManId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Delivery Man assigned successfully!");
        navigate("/admin/OrdersByStatus");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Group orders by assignedTo (delivery man)
  const ordersByDeliveryMan = {};
  allOrders.forEach((order) => {
    if (order.assignedTo && order.assignedTo._id) {
      const deliveryManId = order.assignedTo._id;
      if (!ordersByDeliveryMan[deliveryManId]) {
        ordersByDeliveryMan[deliveryManId] = [];
      }
      ordersByDeliveryMan[deliveryManId].push(order);
    }
  });
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <HiOutlineUserGroup className="w-6 h-6 text-indigo-500" />
        Delivery Men Profiles
      </h2>
      {orderId && (
        <p className="mb-4 text-gray-600">
          Assigning for Order ID:{" "}
          <span className="font-semibold">{orderId}</span>
        </p>
      )}
      {order && (
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="mb-1">
            <span className="font-medium">Items:</span>{" "}
            {order.items?.map((item, idx) => (
              <span key={idx}>
                {item.product?.name} x {item.quantity}
                {idx < order.items.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
          <div className="mb-1">
            <span className="font-medium">Address:</span>{" "}
            {order.address?.street}, {order.address?.city},{" "}
            {order.address?.country}
          </div>
          <div className="mb-1">
            <span className="font-medium">Amount:</span> ${order.amount}
          </div>
          <div className="mb-1">
            <span className="font-medium">Payment Type:</span>{" "}
            {order.paymentType}
          </div>
          <div>
            <span className="font-medium">Zone:</span> {order.zone}
          </div>
        </div>
      )}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Zone</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {deliveryMen.map((deliveryMan) => (
            <tr key={deliveryMan._id}>
              <td className="border border-gray-300 px-4 py-2">
                {deliveryMan.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {deliveryMan.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={
                    deliveryMan.zone?.name === order?.zone
                      ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold"
                      : ""
                  }
                >
                  {deliveryMan.zone?.name || "N/A"}
                  {deliveryMan.zone?.name === order?.zone && (
                    <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                      Zone Match
                    </span>
                  )}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition duration-200 disabled:opacity-50"
                  onClick={() => assignDeliveryMan(deliveryMan._id)}
                  disabled={!!order?.assignedTo}
                  title={
                    order?.assignedTo ? "Order already assigned" : "Assign"
                  }
                >
                  <HiOutlineUserPlus className="w-4 h-4" />
                  <span>Assign Order</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-10">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <HiOutlineClipboardDocumentList className="w-5 h-5 text-indigo-500" />
          Delivery Men & Their Orders
        </h3>
        {deliveryMen.map((dm) => (
          <div key={dm._id} className="mb-6 p-4 border rounded bg-gray-50">
            <div className="font-medium text-gray-800">
              {dm.name} ({dm.email})
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Zone: {dm.zone?.name || "N/A"}
            </div>
            {ordersByDeliveryMan[dm._id]?.length ? (
              <ul className="space-y-4 ml-2">
                {ordersByDeliveryMan[dm._id].map((order) => (
                  <li
                    key={order._id}
                    className="p-3 bg-white rounded shadow border"
                  >
                    <div>
                      <span className="font-semibold">Order ID:</span>{" "}
                      <span className="font-mono">{order._id}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={
                          order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            : "bg-gray-100 text-gray-800 px-2 py-1 rounded"
                        }
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <HiOutlineClipboardDocumentList className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Items:</span>
                        {/* ... */}
                      </div>
                      <ul className="ml-4">
                        {order.items?.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 my-1"
                          >
                            {item.product?.image?.[0] && (
                              <img
                                src={item.product.image[0]}
                                alt={item.product?.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span>
                              {item.product?.name} x {item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Address:</span>
                        {/* ... */}
                      </div>{" "}
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.country}
                    </div>
                    <div>
                      <span className="font-semibold">Amount:</span> $
                      {order.amount}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <HiOutlineCreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Payment Type:</span>
                      </div>
                      {order.paymentType}
                    </div>
                    <div>
                      <span className="font-semibold">Zone:</span>{" "}
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {order.zone}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 italic">No assigned orders</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMenList;
