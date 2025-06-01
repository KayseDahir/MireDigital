import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const { axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const { data } = await axios.post("/api/newsletter/subscribe", {
        email,
      });
      toast.success(data.message || "Subscribed to newsletter successfully!");
      setEmail("");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "An error occurred while subscribing. Please try again.";
      toast.error(msg);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold">
        Stay Updated with MireDigital!
      </h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Join our newsletter to receive the latest updates, insights, and special
        offers tailored for you.
      </p>
      <form
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary transition-all cursor-pointer rounded-md rounded-l-none hover:bg-secondary"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};
export default NewsLetter;
