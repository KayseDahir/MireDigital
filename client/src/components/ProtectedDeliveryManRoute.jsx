import { useAppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedDeliveryManRoute = ({ children }) => {
  const { deliveryMan, loadingDeliveryMan } = useAppContext();

  if (loadingDeliveryMan) return <div>Loading...</div>;
  if (!deliveryMan) return <Navigate to="/delivery-man/login" />;
  return children;
};

export default ProtectedDeliveryManRoute;
