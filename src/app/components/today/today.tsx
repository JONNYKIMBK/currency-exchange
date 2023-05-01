"use client";

import { useEffect, useState } from "react";

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
      const todayValue = await fetch(`/api/today`).then((value) => {
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
