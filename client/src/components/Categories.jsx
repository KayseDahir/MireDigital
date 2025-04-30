import { useAppContext } from "../context/AppContext";

// const categories = [
//   {
//     text: "Smartphones",
//     path: "smartphones",
//     image: "/images/Smartphones.jpg",
//     bgColor: "#fdf2e9",
//   },
//   {
//     text: "Laptops",
//     path: "laptops",
//     image: "/images/Laptops.jpg",
//     bgColor: "#fae5d3",
//   },
//   {
//     text: "Gaming Consoles",
//     path: "gaming-consoles",
//     image: "/images/GamingConsoles.jpg",
//     bgColor: "#eb984e",
//   },
//   {
//     text: "Smartwatches",
//     path: "smartwatches",
//     image: "/images/Smartwatches.jpg",
//     bgColor: "#cf711f",
//   },
//   {
//     text: "Accessories",
//     path: "accessories",
//     image: "/images/Accessories.jpg",
//     bgColor: "#e67e22",
//   },
//   {
//     text: "Tablets",
//     path: "tablets",
//     image: "/images/Tablets.jpg",
//     bgColor: "#fdf2e9",
//   },
//   {
//     text: "Headphones",
//     path: "headphones",
//     image: "/images/Headphones.jpg",
//     bgColor: "#fae5d3",
//   },
//   {
//     text: "Cameras",
//     path: "cameras",
//     image: "/images/Cameras.jpg",
//     bgColor: "#eb984e",
//   },
// ];
function Categories() {
  const { navigate, categories } = useAppContext();
  console.log(categories);
  return (
    <div>
      <h2 className="text-2xl font-bold text-left mt-8 ">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {categories.map((category) => (
          <div
            key={category.text}
            className="relative group cursor-pointer"
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`),
                window.scrollTo(0, 0);
            }}
          >
            <img
              src={`http://localhost:4000/${category.image.replace("\\", "/")}`} // Fix the image path
              alt={category.text}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {category.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
