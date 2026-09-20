import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await clearAuthCookies();
  return NextResponse.redirect(new URL("/", request.url));
}
