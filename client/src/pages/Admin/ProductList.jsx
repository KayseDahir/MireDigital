import toast from "react-hot-toast";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useAppContext } from "../../context/AppContext";

function ProductList() {
  const { products, axios, fetchProducts } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/product/stock",
        { id, inStock },
        { withCredentials: true }
      );
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between bg-gray-50">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-xl font-semibold text-gray-800">
          All Products
        </h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-lg bg-white shadow-md border border-gray-200">
          <table className="table-auto w-full  min-w-[700px]">
            <thead className="bg-gray-100 text-gray-800 text-sm font-medium">
              <tr>
                <th className="px-4 py-3 text-left min-w-[160px] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiOutlineCube className="inline w-5 h-5 text-primary" />
                    Product
                  </div>
                </th>
                <th className="px-4 py-3 text-left min-w-[140px] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiOutlineTag className="inline w-5 h-5 text-primary" />
                    Category
                  </div>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell min-w-[160px] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiOutlineCurrencyDollar className="inline w-5 h-5 text-primary" />
                    Selling Price
                  </div>
                </th>
                <th className="px-4 py-3 text-left min-w-[140px] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="inline w-5 h-5 text-primary" />
                    In Stock
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img src={product.image} alt="Product" className="w-16" />
                    </div>
                    <span className="truncate max-sm:hidden w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    ${product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onClick={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 flex items-center justify-center">
                        {product.inStock ? (
                          <HiOutlineCheck className="text-green-500 w-4 h-4" />
                        ) : (
                          <HiOutlineXMark className="text-gray-400 w-4 h-4" />
                        )}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
