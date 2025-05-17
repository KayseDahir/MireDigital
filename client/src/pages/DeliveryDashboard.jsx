import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import DeliveryManNavbar from "./DeliveryManNavbar";

const DeliveryDashboard = () => {
  const { axios, deliveryMan } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); // { orderId: otp }

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/delivery-man/assigned-orders",
          { withCredentials: true }
        );
        if (data.success) setOrders(data.data);
        else toast.error(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch orders");
      }
    };
    fetchAssignedOrders();
  }, [axios]);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      const otp = otpInputs[orderId];
      if (!otp) return toast.error("Please enter the OTP");
      const { data } = await axios.post(
        "http://localhost:4000/api/delivery-man/verify-otp",
        { orderId, otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Order marked as delivered!");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
        setOtpInputs((prev) => ({ ...prev, [orderId]: "" }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <DeliveryManNavbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Delivery Man Dashboard</h1>
        <p className="mb-6">
          Welcome, {deliveryMan?.name}! Here are your assigned orders:
        </p>
        {orders.length === 0 ? (
          <div className="text-gray-500">No assigned orders.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-white rounded shadow border"
              >
                <div>
                  <span className="font-semibold">Order ID:</span>{" "}
                  <span className="font-mono">{order._id}</span>
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                        : "bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    }
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-4">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.product?.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.country}
                </div>
                <div>
                  <span className="font-semibold">Amount:</span> ${order.amount}
                </div>
                <div>
                  <span className="font-semibold">Payment Type:</span>{" "}
                  {order.paymentType}
                </div>
                <div>
                  <span className="font-semibold">Zone:</span>{" "}
                  {order.zone?.name || order.zone}
                </div>
                {order.status !== "Delivered" && (
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ""}
                      onChange={(e) =>
                        handleOtpChange(order._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleVerifyOtp(order._id)}
                    >
                      Verify OTP & Deliver
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
