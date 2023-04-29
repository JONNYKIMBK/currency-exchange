import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const todayValue = await fetch(
    "https://api.bluelytics.com.ar/v2/latest"
  ).then((value) => {
    return value.json();
  });

  const historicValue = await fetch(
    "https://api.bluelytics.com.ar/v2/evolution.json"
  ).then((value) => {
    return value.json();
  });

  const time = new Date();

  const getToday = (date: Date) => {
    const time = date;
    const year = time.getFullYear();

    const month = time.getMonth() + 1;
    let newMonth = "0";
    if (month < 10) {
      newMonth = "0" + month;
    } else {
      newMonth = month.toString();
    }

    const day = time.getDate();
    let newDay = "0";

    if (day < 10) {
      newDay = "0" + day;
    } else {
      newDay = day.toString();
    }
    const today = year + "-" + newMonth + "-" + newDay;
    return today;
  };

  const today = getToday(time);

  let week = [];

  const subtractDays = (date: Date, days: number) => {
    let newDate = new Date(date.setDate(date.getDate() - days));

    return newDate;
  };

  for (let i = 0; i < 6; i++) {
    let day: string = "";
    if (subtractDays(new Date(), 1 + i).getDay() === 0) {
      day = getToday(subtractDays(new Date(), 3 + i));
    }
    if (subtractDays(new Date(), 1 + i).getDay() === 6) {
      day = getToday(subtractDays(new Date(), 4 + i));
    }

    if (
      !(subtractDays(new Date(), 1 + i).getDay() === 6) &&
      !(subtractDays(new Date(), 1 + i).getDay() === 0)
    ) {
      day = getToday(subtractDays(new Date(), 1 + i));
    }

    const officialValue = historicValue.find((element: any) => {
      if (element.date === day && element.source === "Oficial") {
        return true;
      }
    });
    const blueValue = historicValue.find((element: any) => {
      if (element.date === day && element.source === "Blue") {
        return true;
      }
    });

    if (day.length)
      week.push([
        day,
        (officialValue.value_sell + officialValue.value_buy) / 2,
        (blueValue.value_sell + blueValue.value_buy) / 2,
      ]);
  }

  let data = [
    ["Date", "Official value", "Blue value"],
    [today, todayValue.oficial.value_avg, todayValue.blue.value_avg],
  ];
  data = data.concat(week);

  const response = {
    data: data,
  };

  return NextResponse.json(response);
}
