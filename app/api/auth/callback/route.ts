import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_STATE_COOKIE,
  clearAuthStateCookie,
  setAuthCookiesOnResponse,
} from "@/lib/cookies";
import { exchangeCodeForTokens } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=auth_denied", request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(AUTH_STATE_COOKIE)?.value;

  if (!code || !state || state !== storedState) {
    const response = NextResponse.redirect(
      new URL("/?error=invalid_state", request.url),
    );
    clearAuthStateCookie(response);
    return response;
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAuthStateCookie(response);
    setAuthCookiesOnResponse(
      response,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in,
    );
    return response;
  } catch {
    const response = NextResponse.redirect(
      new URL("/?error=token_exchange", request.url),
    );
    clearAuthStateCookie(response);
    return response;
  }
}
