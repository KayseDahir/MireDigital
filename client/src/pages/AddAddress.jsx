import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

// Input Field component
function InputField({ type, placeholder, name, handleChange, address }) {
  return (
    <input
      className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
      required
    />
  );
}

function AddAddress() {
  console.log("AddAddress component rendered");
  const [zones, setZones] = useState([]); // Store zones fetched from the backend
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
    zone: "", // Add zone field
  });

  const { axios, navigate, regularUser } = useAppContext();

  // Fetch zones from the backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await axios.get("/api/public/zones");
        console.log("Fetched zones response:", data); // Debug log
        if (data.success) {
          setZones(data.data); // Correctly access the zones from data.data
          console.log("Zones state updated:", data.data); // Debug log
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching zones:", error); // Debug log
        toast.error(error.response?.data?.message || "Failed to fetch zones");
      }
    };
    fetchZones();
  }, [axios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        setAddress({
          firstName: "",
          lastName: "",
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          phone: "",
          email: "",
          zone: "",
        });
        navigate("/cart");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (regularUser === null) {
      navigate("/cart");
    }
  }, [regularUser, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10 ">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <InputField
              type="email"
              placeholder="Email Address"
              name="email"
              handleChange={handleChange}
              address={address}
            />
            <InputField
              type="text"
              placeholder="Street Address"
              name="street"
              handleChange={handleChange}
              address={address}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                placeholder="City"
                name="city"
                handleChange={handleChange}
                address={address}
              />
              <InputField
                type="text"
                placeholder="State"
                name="state"
                handleChange={handleChange}
                address={address}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="number"
                placeholder="zip code"
                name="zipCode"
                handleChange={handleChange}
                address={address}
              />
              <InputField
                type="text"
                placeholder="Country"
                name="country"
                handleChange={handleChange}
                address={address}
              />
            </div>
            <InputField
              type="number"
              name="phone"
              address={address}
              handleChange={handleChange}
            />
            {/* Zone Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <select
                name="zone"
                value={address.zone}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
            <button
              type="submit"
              className="w-full mt-6 py-3 text-white bg-primary hover:bg-indigo-600 transition-all cursor-pointer rounded-md uppercase"
            >
              Save Address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src="/images/add-address-image.svg"
          alt="Add Address"
        />
      </div>
    </div>
  );
}

export default AddAddress;
