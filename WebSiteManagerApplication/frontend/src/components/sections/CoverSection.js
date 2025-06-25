import React from "react";
import { Typography } from "@mui/material";

function CoverSection() {
  return (
    <div
      style={{
        height: "300px",
        background: "linear-gradient(135deg, #4e79a7, #9b59b6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        padding: "0 20px",
      }}
    >
      <Typography
        variant="h3"
        style={{
          fontWeight: "bold",
          fontSize: "3rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Welcome to Our Website
      </Typography>
    </div>
  );
}

export default CoverSection;
