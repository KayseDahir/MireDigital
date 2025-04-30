import { useState } from "react";

//Input Filed component
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
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

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
                type=""
                placeholder="country"
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
