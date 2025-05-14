import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Fab,
  Grid,
  Select,
  MenuItem as SelectMenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";

function InStock() {
  const { products, updateProduct, deleteProduct, axios } = useAppContext();

  // State for search, sort, and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");

  // Filtered and sorted products
  const filteredProducts = products
    .filter((product) => product.inStock === true)
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Other states (edit, delete, snackbar, etc.)
  const [editProduct, setEditProduct] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEditClick = () => {
    setEditProduct(selectedProduct);
    setOpenEdit(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setEditProduct(selectedProduct);
    setOpenDelete(true);
    handleMenuClose();
  };

  const handleOutStockClick = () => {
    const updatedProduct = { ...selectedProduct, inStock: false };
    updateProduct(updatedProduct);
    setSnackbarMessage("Product marked as out of stock!");
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditProduct(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setEditProduct(null);
  };

  const handleSave = async () => {
    if (!editProduct) return;
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/product/update",
        {
          id: editProduct._id,
          productData: {
            name: editProduct.name,
            description: editProduct.description,
            category: editProduct.category,
            quantity: editProduct.quantity,
            price: editProduct.price,
          },
        },
        { withCredentials: true } // Move this to the third parameter
      );

      updateProduct(editProduct);
      setSnackbarMessage(data.message || "Product updated successfully!");
      setSnackbarOpen(true);
      handleCloseEdit();
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/product/delete",
        { id: editProduct._id },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        deleteProduct(editProduct._id);
        handleCloseDelete();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        In Stock Items
      </Typography>

      {/* Search, Sort, and Filter */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem", // Add spacing between controls
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.5rem" }}
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        {/* Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Image
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Product Name
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Category
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Price
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Quantity
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Total
                </TableCell>
                <TableCell className="font-bold bg-gray-100 text-center py-2">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow
                    key={product._id}
                    style={{
                      backgroundColor:
                        product.quantity < 5 ? "#fff9ed" : "inherit",
                    }}
                  >
                    <TableCell style={{ width: "100px" }}>
                      <img
                        src={product.image || "https://via.placeholder.com/50"}
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
                    <TableCell>
                      ${(product.price * product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          color="primary"
                          onClick={(event) => handleMenuOpen(event, product)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon style={{ color: "#e67e22", marginRight: "8px" }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon style={{ color: "#e67e22", marginRight: "8px" }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleOutStockClick}>
          <RemoveShoppingCartIcon
            style={{ color: "#e67e22", marginRight: "8px" }}
          />
          Mark as Out of Stock
        </MenuItem>
      </Menu>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      {/* Edit Product Dialog */}
      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            name="name"
            value={editProduct?.name || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl margin="dense" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editProduct?.category || ""}
              onChange={handleInputChange}
            >
              {Array.from(new Set(products.map((p) => p.category))).map(
                (category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={editProduct?.price || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            type="number"
            value={editProduct?.quantity || ""}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product{" "}
            <strong>{editProduct?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default InStock;
