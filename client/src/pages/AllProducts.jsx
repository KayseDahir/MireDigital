import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import filterAndSortProducts from "../utility/filterAndSortProducts";
function Allproducts() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { products } = useAppContext();

  const filtered = filterAndSortProducts(
    products,
    localSearchQuery,
    sortBy,
    filterCategory
  );
  useEffect(() => {
    if (localSearchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(localSearchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, localSearchQuery]);
  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <p className="text-sm text-gray-500 pb-4">
          {filtered.length} items found for {localSearchQuery || "all"}
        </p>

        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {/* Search, Sort, and Filter Controls */}
      <div className="flex justify-end gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)} // Update global searchQuery if needed
          className="border p-2 rounded text-sm w-40"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded text-sm w-40"
        >
          <option value="asc">Sort by Price: Low to High</option>
          <option value="desc">Sort by Price: High to Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded text-sm w-40"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-22 gap-y-6 lg:grid-cols-4 mt-6">
        {filtered.map((product, index) => (
          <div
            key={index}
            className={`${product.inStock ? "bg-white" : "bg-gray-100"}`}
          >
            <ProductCard product={product} />
            {!product.inStock && (
              <p className="text-sm text-red-600 mt-2">Out of stock</p>
            )}
          </div>
        ))}
        {/* {filtered
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))} */}
      </div>
    </div>
  );
}

export default Allproducts;
