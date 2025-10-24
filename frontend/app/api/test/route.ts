import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call your backend Express server
    const res = await fetch("http://localhost:5000/api/test");
    const data = await res.json();

    // Return the data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return NextResponse.json(
      { message: "Backend connection failed" },
      { status: 500 }
    );
  }
}
