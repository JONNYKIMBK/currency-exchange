"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Box, TextField, Typography } from "@mui/material";

export default function Graph() {
  const [data, setData] = useState<DataRow[]>([]);
  const [format, setFormat] = useState("dd/MM/yyyy");

  const [startDate, setStartDate] = useState("n");
  const [endDate, setEndDate] = useState("n");

  const [errorMessage, setErrorMessage] = useState("");

  type ApiDataRow = [string, number, number];

  interface DataRow {
    date: string;
    value1: number;
    value2: number;
  }

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartDate = event.target.value;
    if (
      new Date(newStartDate) < new Date() &&
      (endDate === "n" ||
        !endDate ||
        new Date(newStartDate) < new Date(endDate))
    ) {
      setStartDate(newStartDate);
      setErrorMessage("");
    } else {
      setStartDate("n");
      setErrorMessage(
        "Start date must be before the current date and the end date."
      );
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    if (
      new Date(newEndDate) < new Date() &&
      (startDate === "n" ||
        !startDate ||
        new Date(newEndDate) > new Date(startDate))
    ) {
      setEndDate(newEndDate);
      setErrorMessage("");
    } else {
      setEndDate("n");
      setErrorMessage(
        "End date must be before the current date and after the start date."
      );
    }
  };

  function generateTicks(data: DataRow[], numTicks: number): Date[] {
    const dates = data.map((row) => new Date(row.date));
    const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));
    const interval = (maxDate.getTime() - minDate.getTime()) / (numTicks - 1);
    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
      ticks.push(new Date(minDate.getTime() + interval * i));
    }
    return ticks;
  }

  useEffect(() => {
    const getGraph = async (startDate?: string, endDate?: string) => {
      const response = await fetch(`/api/graph/${startDate}/${endDate}`);

      const todayGraph = await response.json();

      const mappedData = todayGraph.data.slice(1).map((row: ApiDataRow) => ({
        date: row[0],
        value1: row[1],
        value2: row[2],
      }));

      setData(mappedData);
    };
    getGraph(startDate, endDate);

    if (data.length > 30) {
      setFormat("MM/yyyy");
    } else if (data.length > 365) {
      setFormat("yyyy");
    }
  }, [startDate, endDate]);

  if (data.length) {
    const ticks = generateTicks(data, 7);

    const chartData = [
      ["Date", "Official Value", "Blue Value"],
      ...data.map((row) => [new Date(row.date), row.value1, row.value2]),
    ];

    const options = {
      title: "Dollar",
      titleTextStyle: {
        color: "white",
      },
      hAxis: {
        ticks: ticks,
        format: format,
        textStyle: {
          color: "white",
        },
        gridlines: {
          color: "white",
        },
      },
      vAxis: {
        textStyle: {
          color: "white",
        },
        gridlines: {
          color: "white",
        },
      },
      legend: {
        textStyle: {
          color: "white",
        },
      },
      colors: ["#00ff00", "#4169e1"],
      backgroundColor: "#212121",
    };

    if (data.length) {
      return (
        <Box sx={{ backgroundColor: "#212121" }}>
          <Typography variant="h5" style={{ color: "white" }}>
            Graph
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white" },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white" },
              }}
            />
            {errorMessage && (
              <Typography variant="body1" style={{ color: "red" }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
          <Chart
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </Box>
      );
    }
  }
}
