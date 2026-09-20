import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
} from "./cookies";
import { refreshAccessToken } from "./spotify";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const cookieStore = await cookies();
  const expiry = Date.now() + expiresIn * 1000;

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: expiresIn,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });

  cookieStore.set(TOKEN_EXPIRY_COOKIE, String(expiry), {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(TOKEN_EXPIRY_COOKIE);
}

export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  const expiry = cookieStore.get(TOKEN_EXPIRY_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const isExpired = expiry ? Date.now() >= Number(expiry) - 60_000 : false;

  if (!isExpired) {
    return accessToken;
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);
    await setAuthCookies(
      tokens.access_token,
      tokens.refresh_token ?? refreshToken,
      tokens.expires_in,
    );
    return tokens.access_token;
  } catch {
    await clearAuthCookies();
    return null;
  }
}
