import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function AdminLogin() {
  const { isAdmin, setIsAdmin, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });
      if (data.success) {
        setIsAdmin(true);
        toast.success(data.message);
        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && (
        <form
          onSubmit={handleLogin}
          className="min-h-screen flex items-center text-sm text-gray-600"
        >
          <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
            <p className="text-2xl font-medium m-auto">
              <span className="text-primary">Admin</span>Login
            </p>
            <div className="w-full">
              <p>Email</p>
              <input
                type="email"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                placeholder="Enter your email id"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                type="password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary cursor-pointer rounded-md py-2 text-white"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default AdminLogin;
