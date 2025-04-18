import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AdminLayout = () => {
  const { setIsAdmin } = useAppContext();
  const sidebarLinks = [
    { name: "Add Product", path: "/admin", icon: "/icons/add-icon.svg" },
    {
      name: "Product list",
      path: "/admin/product-list",
      icon: "/icons/product-list-icon.svg",
    },
    {
      name: "orders",
      path: "/admin/orders",
      icon: "/icons/order_icon.svg",
    },
  ];

  const handleLogout = async () => {
    setIsAdmin(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
        <Link to={"/"}>
          <img
            className="cursor-pointer w-34 md:w-38"
            src="/images/mirelogo.png"
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={handleLogout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex ">
        <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                          ${
                            isActive
                              ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                              : "hover:bg-gray-100/90 border-white "
                          }`}
            >
              <img src={item.icon} alt="" className="w-7 h-7" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
