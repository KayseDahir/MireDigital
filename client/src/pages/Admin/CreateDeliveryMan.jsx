import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineMapPin,
  HiOutlinePlusCircle,
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CreateDeliveryMan = () => {
  const { axios, navigate } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    zone: "",
  });
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState("");

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/zones",
          { withCredentials: true }
        );
        if (data.success) setZones(data.data);
        else toast.error(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch zones");
      }
    };
    fetchZones();
  }, [axios]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddZone = async () => {
    if (!newZone.trim()) {
      toast.error("Zone name cannot be empty");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/admin/create-zone",
        { name: newZone },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Zone added successfully");
        setZones([...zones, data.zone]);
        setNewZone("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add zone");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/admin/create-delivery-man",
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", password: "", zone: "" });
        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Delivery Man
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition">
            <HiOutlineUser className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition">
            <HiOutlineEnvelope className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition">
            <HiOutlineLockClosed className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone
          </label>
          <div className="flex gap-2">
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary outline-none transition"
              required
            >
              <option value="">Select a zone</option>
              {zones && zones.length > 0 ? (
                zones.map((zone) => (
                  <option key={zone._id} value={zone.name}>
                    {zone.name}
                  </option>
                ))
              ) : (
                <option disabled>No zones available</option>
              )}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-4 mb-2">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase">
              or add new zone
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex mt-3 gap-2">
            <input
              type="text"
              placeholder="New zone name"
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddZone}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
            >
              <HiOutlinePlusCircle className="w-5 h-5" />
              Add Zone
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition font-semibold"
        >
          Create Delivery Man
        </button>
      </form>
    </div>
  );
};

export default CreateDeliveryMan;
