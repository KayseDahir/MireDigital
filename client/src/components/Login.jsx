import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { setShowUserLogin, setRegularUser, axios, navigate } = useAppContext();

  const onSubmithandler = async (e) => {
    try {
      e.preventDefault();
      if (state === "signup") {
        const { data } = await axios.post(`/api/user/signup`, {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setState("verifyOtp");
          console.log("User after login:", data.user);
        } else {
          toast.error(data.message);
        }
      } else if (state === "verifyOtp") {
        const { data } = await axios.post("/api/user/verify-otp", {
          email,
          otp,
        });

        if (data.success) {
          toast.success(data.message);
          setState("login");
        } else {
          toast.error(data.message);
        }
      } else {
        //Login request
        const { data } = await axios.post(`/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          setRegularUser(data.user);
          navigate("/");
          setShowUserLogin(false);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center text-sm text-gray-600 bg-black/50 "
    >
      <form
        onSubmit={onSubmithandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white "
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login"
            ? "Login"
            : state === "signup"
            ? "Sign Up"
            : "Verify OTP"}
        </p>

        {state === "signup" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {state !== "verifyOtp" && (
          <>
            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="email"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="password"
                required
              />
            </div>
          </>
        )}

        {state === "verifyOtp" && (
          <div className="w-full">
            <p>Enter OTP</p>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              placeholder="Enter the OTP sent to your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {state === "signup" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : state === "login" ? (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("signup")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : null}

        <button className="bg-primary hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "signup"
            ? "Create Account"
            : state === "login"
            ? "Login"
            : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default Login;
