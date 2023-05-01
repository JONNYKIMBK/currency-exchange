import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Data = [string, number, number];

export async function GET(request: NextRequest, { params }: any) {
  const getToday = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startDate = params.pars[0] !== "n" ? params.pars[0] : undefined;
  const endDate =
    params.pars[1] !== "n" ? params.pars[1] : getToday(new Date());

  const todayValueResponse = await fetch(
    "https://api.bluelytics.com.ar/v2/latest"
  );
  const todayValue = await todayValueResponse.json();

  const historicValueResponse = await fetch(
    "https://api.bluelytics.com.ar/v2/evolution.json"
  );
  const historicValue = await historicValueResponse.json();

  const historicValueByDateAndSource: Record<string, any> = {};
  for (const element of historicValue) {
    if (!historicValueByDateAndSource[element.date]) {
      historicValueByDateAndSource[element.date] = {};
    }
    historicValueByDateAndSource[element.date][element.source] = element;
  }

  const time = new Date();

  const today = getToday(time);

  const subtractDays = (date: Date, days: number) => {
    let newDate = new Date(date.setDate(date.getDate() - days));

    return newDate;
  };

  let week: Data[] = [];

  if (startDate && endDate) {
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      if (currentDate.getUTCDay() !== 0 && currentDate.getUTCDay() !== 6) {
        const day = getToday(currentDate);

        const officialValue = historicValueByDateAndSource[day]?.["Oficial"];
        const blueValue = historicValueByDateAndSource[day]?.["Blue"];

        if (officialValue && blueValue) {
          week.push([
            day,
            (officialValue.value_sell + officialValue.value_buy) / 2,
            (blueValue.value_sell + blueValue.value_buy) / 2,
          ]);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    let daysFound = 0;

    for (let i = 1; daysFound < 6; i++) {
      const currentDate = subtractDays(new Date(), i);
      if (currentDate.getUTCDay() === 0 || currentDate.getUTCDay() === 6) {
        continue;
      }

      const day = getToday(currentDate);
      daysFound++;

      const officialValue = historicValueByDateAndSource[day]?.["Oficial"];
      const blueValue = historicValueByDateAndSource[day]?.["Blue"];

      if (officialValue && blueValue) {
        week.push([
          day,
          (officialValue.value_sell + officialValue.value_buy) / 2,
          (blueValue.value_sell + blueValue.value_buy) / 2,
        ]);
      }
    }
  }

  let data: (string[] | Data)[] = [["Fecha", "Valor oficial", "Valor blue"]];

  if (startDate) {
    data = data.concat(
      week
        .filter((row) => {
          const date = new Date(row[0]);
          return (
            row[0] >= startDate &&
            row[0] <= endDate &&
            date.getUTCDay() !== 0 &&
            date.getUTCDay() !== 6
          );
        })
        .map((row): Data => [row[0], row[1], row[2]])
    );
  } else {
    data.push([today, todayValue.oficial.value_avg, todayValue.blue.value_avg]);
    data = data.concat(week.map((row): Data => [row[0], row[1], row[2]]));
  }

  const response = {
    data: data,
  };

  return NextResponse.json(response);
}
