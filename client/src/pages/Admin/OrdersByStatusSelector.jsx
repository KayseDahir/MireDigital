import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrdersByStatusSelector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/OrdersByStatus/pending", { replace: true });
  }, [navigate]);

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Select Order Status</h2>
      <select
        className="border px-2 py-1 rounded"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value)
            navigate(`/admin/OrdersByStatus/${e.target.value}`);
        }}
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
    </div>
  );
};

export default OrdersByStatusSelector;
