import React, { useState } from "react";
import { Container, Typography, Menu, MenuItem, Button } from "@mui/material";
import InStock from "./InStock"; // Import InStock component
import OutStock from "./OutStock"; // Import OutStock component (create this if not already present)

function Inventory() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedView, setSelectedView] = useState("InStock"); // Default view

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (view) => {
    setSelectedView(view);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMenuClick}
        style={{ marginBottom: "1rem" }}
      >
        Select View
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleMenuItemClick("InStock")}>
          In Stock
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("OutStock")}>
          Out Stock
        </MenuItem>
      </Menu>

      {/* Render the selected view */}
      {selectedView === "InStock" && <InStock />}
      {selectedView === "OutStock" && <OutStock />}
    </Container>
  );
}

export default Inventory;
