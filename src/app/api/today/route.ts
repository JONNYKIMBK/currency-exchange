import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const todayValue = await fetch("https://api.bluelytics.com.ar/v2/latest", {
    next: { revalidate: 0 },
  }).then((value) => {
    return value.json();
  });

  return NextResponse.json(todayValue);
}
