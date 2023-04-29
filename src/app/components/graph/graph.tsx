"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const URL = "http://localhost:3000";

export const options = {
  title: "Dollar",
  //   curveType: "function",
};

export default function Graph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getGraph = async () => {
      const todayGraph = await fetch(`${URL}/api/graph`).then((data) => {
        return data.json();
      });

      setData(todayGraph.data);
    };
    getGraph();
  }, []);

  if (data.length) {
    return (
      <div>
        Graph
        <Chart
          chartType="LineChart"
          data={data}
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
