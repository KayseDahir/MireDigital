import React from "react";
import { useAppContext } from "../../context/AppContext";
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
  console.log("Products:", products);

  // Filter products that are out of stock
  const outStockProducts = products
    .filter((product) => product.inStock === false) // Filter products with inStock === false
    .reduce((acc, product) => {
      const existingProduct = acc.find((p) => p.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += product.quantity || 1; // Add quantity
      } else {
        acc.push({ ...product, quantity: product.quantity || 1 }); // Default quantity to 1
      }
      return acc;
    }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Out of Stock Items
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
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
            {outStockProducts.map((product) => {
              const totalAmount = product.price * product.quantity;

              return (
                <TableRow key={product._id}>
                  <TableCell>
                    {product._id.slice(0, 3)}...{product._id.slice(-3)}
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
