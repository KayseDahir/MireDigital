import React from "react";
import { useAppContext } from "../../context/AppContext";
import filterAndSortProducts from "../../utility/filterAndSortProducts";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function OutStock() {
  const { products } = useAppContext(); // Fetch products from context
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("asc"); // Default to ascending order
  const [filterCategory, setFilterCategory] = React.useState("");

  // Filter products that are out of stock
  const outStockProducts = products
    .filter((product) => product.inStock === false)
    .reduce((acc, product) => {
      const existingProduct = acc.find((p) => p.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += product.quantity || 1;
      } else {
        acc.push({ ...product, quantity: product.quantity || 1 });
      }
      return acc;
    }, []);

  // Apply filtering and sorting
  const filteredAndSortedProducts = filterAndSortProducts(
    outStockProducts,
    searchQuery,
    sortBy,
    filterCategory
  );

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Out of Stock Items
      </Typography>

      {/* Search, Sort, and Filter Controls */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">All Categories</option>
          {Array.from(new Set(outStockProducts.map((p) => p.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Product Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Quantity</strong>
              </TableCell>
              <TableCell>
                <strong>Total Amount</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedProducts.map((product) => {
              const totalAmount = product.price * product.quantity;

              return (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product?.image}
                      alt={product.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default OutStock;
