import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { setAuthStateCookie } from "@/lib/cookies";
import { getSpotifyConfig, SPOTIFY_AUTH_URL, SPOTIFY_SCOPES } from "@/lib/spotify";

export async function GET() {
  const { clientId, redirectUri } = getSpotifyConfig();
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES,
    state,
  });

  const response = NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${params}`);
  setAuthStateCookie(response, state);

  return response;
}
