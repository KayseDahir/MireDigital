function filterAndSortProducts(products, searchQuery, sortBy, filterCategory) {
  return products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      filterCategory ? product.category === filterCategory : true
    )
    .sort((a, b) => {
      if (sortBy === "asc") return a.price - b.price; // Ascending order
      if (sortBy === "desc") return b.price - a.price; // Descending order
      return 0;
    });
}

export default filterAndSortProducts;
