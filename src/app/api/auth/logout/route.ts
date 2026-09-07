import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out from current local session",
  });

  response.cookies.delete("rankos_user_id");

  return response;
}
