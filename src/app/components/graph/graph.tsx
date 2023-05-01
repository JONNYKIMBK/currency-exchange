"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export default function Graph() {
  const [data, setData] = useState<DataRow[]>([]);
  const [format, setFormat] = useState("dd/MM/yyyy");

  const [startDate, setStartDate] = useState("n");
  const [endDate, setEndDate] = useState("n");

  type ApiDataRow = [string, number, number];

  interface DataRow {
    date: string;
    value1: number;
    value2: number;
  }

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
      hAxis: {
        ticks: ticks,
        format: format,
      },
    };

    return (
      <div>
        Graph
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          {/* ... */}
        </div>
        <Chart
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}
