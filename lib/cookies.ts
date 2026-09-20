import type { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "spotify_access_token";
export const REFRESH_TOKEN_COOKIE = "spotify_refresh_token";
export const TOKEN_EXPIRY_COOKIE = "spotify_token_expiry";
export const AUTH_STATE_COOKIE = "spotify_auth_state";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(AUTH_STATE_COOKIE, state, {
    ...baseCookieOptions,
    maxAge: 600,
  });
}

export function setAuthCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const expiry = Date.now() + expiresIn * 1000;

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: expiresIn,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set(TOKEN_EXPIRY_COOKIE, String(expiry), {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthStateCookie(response: NextResponse) {
  response.cookies.delete(AUTH_STATE_COOKIE);
}
