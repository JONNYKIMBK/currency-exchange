"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
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

    crypto: {
      value_sell: 0,
      value_buy: 0,
    },
  });

  const [exchange, setExchange] = useState("binance");

  const handleChange = (event: SelectChangeEvent) => {
    setExchange(event.target.value as string);
  };

  const [originalValue, setOriginalValue] = useState(value);

  const [inputValue, setInputValue] = useState(1);

  useEffect(() => {
    const getTodayValue = async () => {
      const todayValue = await fetch(`/api/graph/n/n/${exchange}`).then(
        (value) => {
          return value.json();
        }
      );

      setValue({
        oficial: {
          value_sell: todayValue.data[1][1] * inputValue,
          value_buy: todayValue.data[1][2] * inputValue,
        },
        blue: {
          value_sell: todayValue.data[1][3] * inputValue,
          value_buy: todayValue.data[1][4] * inputValue,
        },

        crypto: {
          value_sell: todayValue.data[1][5] * inputValue,
          value_buy: todayValue.data[1][6] * inputValue,
        },
      });
      console.log(todayValue.data[1]);
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

        crypto: {
          value_sell: todayValue.data[1][5],
          value_buy: todayValue.data[1][6],
        },
      });
    };
    getTodayValue();
  }, [exchange]);

  useEffect(() => {
    const newOficialValueSell = originalValue.oficial.value_sell * inputValue;
    const newOficialValueBuy = originalValue.oficial.value_buy * inputValue;

    const newBlueValueSell = originalValue.blue.value_sell * inputValue;
    const newBlueValueBuy = originalValue.blue.value_buy * inputValue;

    const newCriptoValueSell = originalValue.crypto.value_sell * inputValue;
    const newCriptoValueBuy = originalValue.crypto.value_buy * inputValue;

    setValue({
      oficial: {
        value_sell: newOficialValueSell,
        value_buy: newOficialValueBuy,
      },
      blue: {
        value_sell: newBlueValueSell,
        value_buy: newBlueValueBuy,
      },

      crypto: {
        value_sell: newCriptoValueSell,
        value_buy: newCriptoValueBuy,
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

      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ marginRight: { sm: 2 } }}>
            <p style={{ color: "#212121" }}>.</p>
            <p>Venta:</p>

            <p>Compra:</p>
          </Box>
          <Box sx={{ color: "#00ff00", marginRight: { sm: 2 } }}>
            <p>Oficial:</p>
            <p>$ {value.oficial.value_sell}</p>
            <p>$ {value.oficial.value_buy}</p>
          </Box>
          <Box sx={{ color: "#4169e1", marginRight: { sm: 2 } }}>
            <p>Blue:</p>
            <p>$ {value.blue.value_sell}</p>
            <p>$ {value.blue.value_buy}</p>
          </Box>

          <Box sx={{ color: "#ffff00", marginRight: { sm: 2 } }}>
            <p>Cripto:</p>
            <p>$ {value.crypto.value_sell}</p>
            <p>$ {value.crypto.value_buy}</p>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: { xs: 3, sm: 0 },
            marginRight: { xs: 3, sm: 0 },
          }}
        >
          <p>Exchange Cripto</p>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="exchange"
              value={exchange}
              onChange={handleChange}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            >
              <MenuItem value={"binance"}>Binance</MenuItem>
              <MenuItem value={"lemoncash"}>Lemon</MenuItem>
              <MenuItem value={"belo"}>Belo</MenuItem>
              <MenuItem value={"buenbit"}>Buenbit</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
