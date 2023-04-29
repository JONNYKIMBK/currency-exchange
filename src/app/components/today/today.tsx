"use client";

import { useEffect, useState } from "react";

const URL = "http://localhost:3000";

export default function Today() {
  const [value, setValue] = useState({
    oficial: {
      value_avg: 0,
    },
    blue: {
      value_avg: 0,
    },
  });

  useEffect(() => {
    const getTodayValue = async () => {
      const todayValue = await fetch(`${URL}/api/today`).then((value) => {
        return value.json();
      });
      setValue(todayValue);
    };
    getTodayValue();
  }, []);

  return (
    <div>
      <p>Oficial: {value.oficial.value_avg}</p>
      <p>Blue: {value.blue.value_avg}</p>
    </div>
  );
}
