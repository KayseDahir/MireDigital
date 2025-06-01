import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

function BestSeller() {
  const { products } = useAppContext();

  // Get the top 8 best sellers with inStock and sold > 1
  const bestSellers = products
    .filter((product) => product.inStock && product.sold > 1)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8);

  if (!bestSellers || bestSellers.length === 0) {
    return <p>No best sellers available</p>;
  }
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-bold text-left mt-8 ">
        Best Sellers
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {bestSellers
          .filter((product) => product.inStock)
          .slice(0, 8)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              
            />
          ))}
      </div>
    </div>
  );
}

export default BestSeller;
