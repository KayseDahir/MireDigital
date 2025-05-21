import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const OrdersByStatus = () => {
  const { axios, navigate } = useAppContext();
  const [orders, setOrders] = useState([]);
  const { status } = useParams();

  useEffect(() => {
    if (!status) return;
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `/api/order/admin/orders?status=${status}`
        );
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    fetchOrders();
  }, [status, axios]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-6">Orders By Status</h2>
        <div className="flex gap-2">
          {["pending", "Shipped", "Delivered"].map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/admin/OrdersByStatus/${s}`)}
              className={`px-3 py-1 rounded ${
                status === s
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-6">{status} Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">
          No {status?.toLowerCase()} orders found.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Order #{order._id}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      status === "Shipped"
                        ? "bg-purple-100 text-purple-700"
                        : status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                {/* ...rest of your order details... */}
                <div className="text-sm mb-1">
                  <span className="font-semibold">User:</span>{" "}
                  <span className="text-gray-700">
                    {order.userId?.name || order.userId}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Address:</span>{" "}
                  <span className="text-gray-700">
                    {order.address?.street}, {order.address?.city},{" "}
                    {order.address?.country}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Payment:</span>{" "}
                  <span
                    className={order.isPaid ? "text-green-600" : "text-red-600"}
                  >
                    {order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Zone:</span>{" "}
                  <span className="text-gray-700">{order.zone}</span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Order Date:</span>{" "}
                  <span className="text-gray-700">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-4 list-disc text-gray-700">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.product?.name || item.product}{" "}
                        <span className="font-semibold">x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">Total:</span>{" "}
                  <span className="text-blue-700 font-bold">
                    ${order.amount}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-gray-400">
                  {order.items?.length} item
                  {order.items?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersByStatus;
