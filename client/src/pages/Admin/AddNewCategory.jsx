import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function AddNewCategory() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { axios, navigate } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!text || !image) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("path", text.toLowerCase().replace(/\s+/g, "-")); // Generate path from text
    formData.append("image", image);

    console.log([...formData.entries()]); // Debugging: Log formData

    try {
      const { data } = await axios.post("/api/admin/add-category", formData);

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/add-product"); // Redirect back to Add Product page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Error adding category:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[95vh]">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Category
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category-name"
          >
            Category Name
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter category name"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category-image"
          >
            Category Image
          </label>
          <input
            id="category-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        <button
          onClick={() => navigate("/admin")}
          type="submit"
          className="bg-primary hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddNewCategory;
