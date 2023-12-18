import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const Header = ({ title, subtitle}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" color={theme.palette.secondary[100]} fontWeight="bold" sx={{ mb: "5px" }} >
        {title}
      </Typography>
      <Typography variant="h6" color={theme.palette.secondary[300]} fontWeight="bold" sx={{ mb: "5px" }} >
        {subtitle}
      </Typography>
    </Box>

  )
}

export default Header;