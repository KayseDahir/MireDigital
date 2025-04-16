import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

function Allproducts() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, searchQuery } = useAppContext();

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);
  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">Your Favorite Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        
      </div>
      <div></div>
    </div>
  );
}

export default Allproducts;
