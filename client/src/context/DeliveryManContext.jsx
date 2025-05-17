import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DeliveryManContext = createContext();

export const useDeliveryManContext = () => useContext(DeliveryManContext);

export const DeliveryManProvider = ({ children }) => {
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentDeliveryMan = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/delivery-man/current",
        { withCredentials: true }
      );
      if (data.success) setDeliveryMan(data.user);
      else setDeliveryMan(null);
    } catch {
      setDeliveryMan(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentDeliveryMan();
  }, []);

  return (
    <DeliveryManContext.Provider
      value={{ deliveryMan, setDeliveryMan, loading }}
    >
      {children}
    </DeliveryManContext.Provider>
  );
};

export default DeliveryManProvider;
