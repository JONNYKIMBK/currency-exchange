import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const todayValueResponse = await fetch(
    "https://api.bluelytics.com.ar/v2/latest",
    {
      next: { revalidate: 0 },
    }
  );
  const todayValue = await todayValueResponse.json();

  return NextResponse.json(todayValue);
}
