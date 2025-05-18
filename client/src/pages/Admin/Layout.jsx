import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  HiOutlineCube, // Product
  HiOutlineClipboardDocumentList, // Product list
  HiOutlinePlusCircle, // Add Product
  HiOutlineShoppingBag, // Orders
  HiOutlineArchiveBox, // Inventory
  HiOutlineCheckCircle, // InStock
  HiOutlineXCircle, // OutStock
  HiOutlineTruck, // Delivery Management
  HiOutlineUserPlus, // Create Delivery Man
  HiOutlineUsers, // Delivery Men List
  HiOutlineDocumentText, // OrdersByStatus
  HiOutlineChartBar, // Dashboard
} from "react-icons/hi2";

const AdminLayout = () => {
  const { navigate, axios, setIsAdmin, user } = useAppContext();
  const [openDropdown, setOpenDropdown] = useState([]); // Track which dropdown is open

  const userName = user?.email ? user.email.split("@")[0] : "Admin";
  const sidebarLinks = [
    {
      name: "Product",
      icon: <HiOutlineCube className="w-6 h-6" />,
      children: [
        {
          name: "Add Product",
          path: "/admin",
          icon: <HiOutlinePlusCircle className="w-5 h-5" />,
        },
        {
          name: "Product list",
          path: "/admin/product-list",
          icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <HiOutlineShoppingBag className="w-7 h-7" />,
    },
    {
      name: "Inventory",
      icon: <HiOutlineArchiveBox className="w-7 h-7" />,
      children: [
        {
          name: "InStock",
          path: "/admin/InStock",
          icon: <HiOutlineCheckCircle className="w-5 h-5" />,
        },
        {
          name: "OutStock",
          path: "/admin/outStock",
          icon: <HiOutlineXCircle className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Delivery Management",
      icon: <HiOutlineTruck className="w-7 h-7" />,
      children: [
        {
          name: "Create Delivery Man",
          path: "/admin/create-delivery-man",
          icon: <HiOutlineUserPlus className="w-5 h-5" />,
        },
        {
          name: "Delivery Men List",
          path: "/admin/delivery-men",
          icon: <HiOutlineUsers className="w-5 h-5" />,
        },
        {
          name: "OrdersByStatus",
          path: "/admin/OrdersByStatus",
          icon: <HiOutlineDocumentText className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <HiOutlineChartBar className="w-7 h-7" />,
    },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/admin/logout", {});
      if (data.success) {
        toast.success(data.message);
        setIsAdmin(false); // Clear admin state
        navigate("/admin"); // Redirect to login page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/admin/is-Auth");
        if (!data.success) {
          console.log("data", data);
          setIsAdmin(false);
          navigate("/admin");
        }
      } catch (error) {
        console.log(error.message);
        setIsAdmin(false);
        navigate("/admin");
      }
    };

    checkAuth();
  }, []); // Empty dependency array ensures it runs only once
  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-10 py-4 bg-white shadow-sm ">
        <Link to={"/"}>
          <img
            className="cursor-pointer w-28 md:w-32"
            src="/images/mirelogo.png"
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-sm md:text-base">Hi! {userName} </p>
          <button
            onClick={handleLogout}
            navigate={"/"}
            className="rounded-full text-sm md:text-base px-4 py-2 bg-primary text-white hover:bg-primary-dark transition"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-60 w-16 h-[95vh] bg-gray-50 text-gray-700 flex flex-col pt-6">
          {sidebarLinks.map((item) => {
            // Check if the item has children (dropdown)
            if (item.children) {
              return (
                <div key={item.name}>
                  {/* Render parent link */}
                  <div
                    className={`flex items-center py-3 px-4 gap-3 cursor-pointer hover:bg-gray-100/90`}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    {item.icon}
                    <p className="md:block hidden text-center">{item.name}</p>
                  </div>

                  {/* Render children if dropdown is open */}
                  {openDropdown.includes(item.name) && (
                    <div className="ml-8">
                      {item.children.map((child) => (
                        <NavLink
                          to={child.path}
                          key={child.name}
                          className={({ isActive }) =>
                            `flex items-center py-2 px-4 gap-3 text-sm ${
                              isActive
                                ? "text-primary font-medium"
                                : "hover:bg-gray-100/90 text-gray-500"
                            }`
                          }
                        >
                          {child.icon}
                          <p>{child.name}</p>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Render standalone links (no children)
            return (
              <NavLink
                to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 gap-3 text-sm ${
                    isActive
                      ? "text-primary font-medium"
                      : "hover:bg-gray-100/90 text-gray-500"
                  }`
                }
              >
                {item.icon}
                <p className="md:block hidden text-center">{item.name}</p>
              </NavLink>
            );
          })}
        </div>
        <div className="flex-1 p-6 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
