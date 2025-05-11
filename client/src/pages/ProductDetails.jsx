import Login from "../components/Login";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  // const [selectedColor, setSelectedColor] = useState("Gold");
  const [quantity, setQuantity] = useState(1);
  // const [hoveredColor, setHoveredColor] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { products, navigate, addToCart, user, cartItems } = useAppContext();
  const { id } = useParams();

  const product = products.find((product) => product._id === id);

  

  const cartQuantity = cartItems[product?._id] || 0;

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => product.category === item.category
      );
      setRelatedProducts(productsCopy.slice(0, 4));
    }
  }, [products]);

  useEffect(() => {
    if (product) {
      setThumbnail(product?.image[0] ? product?.image[0] : null);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (quantity > product.quantity) {
      toast.error("Cannot add more than the available stock!");
      return;
    }
    addToCart(product._id, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product._id);
    navigate("/cart");
  };
  return (
    product && (
      <div className="mt-16">
        <p>
          <Link to={"/"}>Home</Link>/<Link to="/products"> Products</Link>
          <Link to={`/product/${product.category.toLowerCase()}`}>
            /{product.category}
          </Link>
          /<span className="text-primary">{product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img src={thumbnail} alt="Selected product" />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    src={
                      i < 4
                        ? "/icons/star_icon.svg"
                        : "/icons/star_dull_icon.svg"
                    }
                    alt="star"
                    className="md:w-4 w-3.5"
                  />
                ))}
              <p className="text-base ml-2">({4})</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: ${product.price}
              </p>
              <p className="text-2xl font-medium">MRP: ${product.offerPrice}</p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex flex-col mt-6 gap-4">
              {/* Product Color Selection */}
              {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 font-medium">
                    Color family:
                  </p>
                  <span className="text-sm text-gray-700 font-medium">
                    {hoveredColor || selectedColor || "Select a color"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[
                    { image: "/images/galaxys23ultra.jpg", color: "Red" },
                    { image: "/images/iPhone-14-Pro.png", color: "Blue" },
                    { image: "/images/iPhone-14-Pro.png", color: "Green" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded overflow-hidden cursor-pointer border border-gray-300"
                      onMouseEnter={() => setHoveredColor(item.color)}
                      onMouseLeave={() => setHoveredColor(null)}
                      onClick={() => setSelectedColor(item.color)}
                    >
                      <img
                        src={item.image}
                        alt={`Color ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Quantity Selection */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-500 font-medium">
                    Quantity:
                  </p>
                  <button
                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                    className="text-gray-600 text-xl font-bold"
                  >
                    -
                  </button>
                  <p className="text-base">{quantity}</p>
                  <button
                    disabled={cartQuantity >= product.quantity}
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(prev + 1, product.quantity || 10)
                      )
                    }
                    className="text-gray-600 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {product.inStock && (
              <div className="flex items-center mt-10 gap-4 text-base">
                <button
                  onClick={handleAddToCart}
                  disabled={cartQuantity >= product.quantity}
                  className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white  transition"
                >
                  Buy now
                </button>
              </div>
            )}
            {!product.inStock && (
              <>
                <p className="text-red-500 font-medium mt-2">Out of Stock</p>
                <div className="mt-4">
                  <button className="bg-gray-400 text-white px-4 py-3 rounded w-full ">
                    Add to Wishlist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
            <div className="relative bg-white p-6 rounded shadow-lg">
              <button
                onClick={() => setShowLoginModal(false)} // Close the modal
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <Login />
            </div>
          </div>
        )}
        {/*----------- related products -------- */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-22 gap-y-6 lg:grid-cols-5 mt-6">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary transition"
          >
            See more
          </button>
        </div>
      </div>
    )
  );
};
export default ProductDetails;
