"use client";

import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Today() {
  const [value, setValue] = useState({
    oficial: {
      value_sell: 0,
      value_buy: 0,
    },
    blue: {
      value_sell: 0,
      value_buy: 0,
    },
  });
  const [originalValue, setOriginalValue] = useState(value);

  const [inputValue, setInputValue] = useState(1);

  useEffect(() => {
    const getTodayValue = async () => {
      const todayValue = await fetch(`/api/graph/n/n`).then((value) => {
        return value.json();
      });

      setValue({
        oficial: {
          value_sell: todayValue.data[1][1],
          value_buy: todayValue.data[1][2],
        },
        blue: {
          value_sell: todayValue.data[1][3],
          value_buy: todayValue.data[1][4],
        },
      });
      // console.log(todayValue.data[1]);
      // console.log(Date());

      setOriginalValue({
        oficial: {
          value_sell: todayValue.data[1][1],
          value_buy: todayValue.data[1][2],
        },
        blue: {
          value_sell: todayValue.data[1][3],
          value_buy: todayValue.data[1][4],
        },
      });
    };
    getTodayValue();
  }, []);

  useEffect(() => {
    const newOficialValueSell = originalValue.oficial.value_sell * inputValue;
    const newOficialValueBuy = originalValue.oficial.value_buy * inputValue;

    const newBlueValueSell = originalValue.blue.value_sell * inputValue;
    const newBlueValueBuy = originalValue.blue.value_buy * inputValue;

    setValue({
      oficial: {
        value_sell: newOficialValueSell,
        value_buy: newOficialValueBuy,
      },
      blue: {
        value_sell: newBlueValueSell,
        value_buy: newBlueValueBuy,
      },
    });
  }, [inputValue]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: { xs: "space-evenly", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        marginBottom: 2,
      }}
    >
      <Box sx={{ marginRight: { sm: 10 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <p>Dollar</p>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-evenly" },
          }}
        >
          <TextField
            type="number"
            value={inputValue}
            onChange={(e) =>
              setInputValue(
                e.target.value === "" ? 0 : parseInt(e.target.value)
              )
            }
            sx={{
              width: 100,
              "& input": { color: "white" },
              "& fieldset": { borderColor: "white" },
              marginRight: 1,
            }}
          />
          <Button variant="contained" onClick={() => setInputValue(1)}>
            Reset
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ marginTop: 5.5, marginRight: 1 }}>
          <p>Venta:</p>

          <p>Compra:</p>
        </Box>
        <Box sx={{ color: "#00ff00", marginRight: { sm: 2 } }}>
          <p>Oficial:</p>
          <p>$ {value.oficial.value_sell}</p>
          <p>$ {value.oficial.value_buy}</p>
        </Box>
        <Box sx={{ color: "#4169e1" }}>
          <p>Blue:</p>
          <p>$ {value.blue.value_sell}</p>
          <p>$ {value.blue.value_buy}</p>
        </Box>
      </Box>
    </Box>
  );
}
