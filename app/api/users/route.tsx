import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextResponse) {
  return NextResponse.json([
    { id: 1, name: "Eduard" },
    { id: 2, name: "John" },
  ]);
}
