import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const { axios } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        console.log("My Orders Data:", data.orders);
        setMyOrders(data.orders);
      } else {
        console.error("API response indicates failure:", data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full "></div>
      </div>
      {myOrders.length > 0
        ? myOrders.map((order, index) => {
            console.log(`Order ${index} Items:`, order.items);
            return (
              // Add return here
              <div
                key={index}
                className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
              >
                <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                  <span>OrderId : {order._id}</span>
                  <span>Payment : {order.paymentType}</span>
                  <span>TotalAmount : $ {order.amount}</span>
                </p>
                {order.items.map((item, index) => {
                  console.log(`Item ${index} Product:`, item.product);
                  return (
                    <div
                      key={index}
                      className={`relative bg-white text-gray-500/70 ${
                        order.items.length !== index + 1 && "border-b"
                      } border-gray-3-- flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <img
                            className="w-16 h-16"
                            src={item.product?.image[0]}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-xl font-medium text-gray-800">
                            {item.product.name}
                          </h2>
                          <p>{item.product.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                        <p>Qunatity: {item.quantity || " 1"}</p>
                        <p
                          className={
                            order.status === "pending"
                              ? "text-blue-400 font-semibold"
                              : order.status === "Shipped"
                              ? "text-orange-500 font-semibold"
                              : order.status === "Delivered"
                              ? "text-green-600 font-semibold"
                              : ""
                          }
                        >
                          Status: {order.status}
                        </p>
                        <p>
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-primary text-lg font-medium">
                        Amount: ${item.product.offerPrice * item.quantity}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })
        : "No orders found"}
    </div>
  );
}

export default MyOrders;
