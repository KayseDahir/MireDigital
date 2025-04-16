import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

function BestSeller() {
  const { products } = useAppContext();
  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-bold text-left mt-8 ">
        Best Sellers
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 4)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default BestSeller;
