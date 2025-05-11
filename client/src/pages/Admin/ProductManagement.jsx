import { Outlet, NavLink } from "react-router-dom";

const ProductManagement = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-100 p-4">
        <nav className="space-y-4">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-4 bg-primary text-white rounded"
                : "block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            }
          >
            Product List
          </NavLink>
          <NavLink
            to="/admin/add-product"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-4 bg-primary text-white rounded"
                : "block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            }
          >
            Add Product
          </NavLink>
          <NavLink
            to="/admin/add-category"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-4 bg-primary text-white rounded"
                : "block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            }
          >
            Add Category
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagement;
