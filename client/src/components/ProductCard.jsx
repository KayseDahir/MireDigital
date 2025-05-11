import { useAppContext } from "../context/AppContext";

function ProductCard({ product }) {
  const { navigate } = useAppContext();

  if (!product) {
    return <div>Product data is unavailable</div>;
  }

  return (
    <div
      onClick={() => {
        navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-transparent rounded-lg shadow-none hover:border-gray-300 hover:shadow-md transition-shadow bg-white w-full h-[350px] flex flex-col justify-between p-4 overflow-hidden"
    >
      {/* Image Section */}
      <div className="group cursor-pointer flex items-center justify-center h-[150px] overflow-hidden">
        <img
          className="group-hover:scale-105 transition-transform max-h-full object-contain"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-1 mt-4 overflow-hidden">
        {/* Category and Name */}
        <div className="overflow-hidden">
          <p className="text-gray-500 text-xs uppercase tracking-wide truncate">
            {product.category}
          </p>
          <p className="text-gray-800 font-semibold text-lg truncate">
            {product.name}
          </p>
        </div>
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mt-2">
          {product.description}
        </p>
        {/* Price Section */}
        <div className="flex items-end justify-between">
          <p className="text-indigo-600 font-semibold text-lg">
            ${product.offerPrice}{" "}
            <span className="text-gray-400 text-sm line-through">
              ${product.price}
            </span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 ">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                src={
                  i < 4 ? "/icons/star_icon.svg" : "/icons/star_dull_icon.svg"
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          <p className="text-gray-500 text-xs">(4)</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
