"use client";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import currenciesData from "./currencies.json";
import dollarData from "./prueba.json";

// let currencies = JSON.stringify(currenciesData);
// currencies = JSON.parse(currencies);
let currencies = Object.values(currenciesData);
let keys = Object.keys(currenciesData);

export default function Currency() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: { xs: "row", md: "column" },
      }}
    >
      <Box sx={{ border: 1, width: 150 }}>
        <FormControl fullWidth>
          <InputLabel>Currency 1</InputLabel>
          <Select label="select">
            {currencies.map((currency, index) => {
              return <MenuItem value={keys[index]}>{currency}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ border: 1, width: 150 }}>
        <FormControl fullWidth>
          <InputLabel>Currency 2</InputLabel>
          <Select label="select">
            {currencies.map((currency, index) => {
              return <MenuItem value={keys[index]}>{currency}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
