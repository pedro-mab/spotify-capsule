export const SPOTIFY_SCOPES = ["user-top-read"].join(" ");

export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  popularity: number;
  external_urls: { spotify: string };
};

export type SpotifyTrack = {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  artists: { name: string }[];
  popularity: number;
  external_urls: { spotify: string };
};

export type TopArtistsResponse = {
  items: SpotifyArtist[];
};

export type TopTracksResponse = {
  items: SpotifyTrack[];
};

export function getSpotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing Spotify credentials. Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REDIRECT_URI.",
    );
  }

  return { clientId, clientSecret, redirectUri };
}

export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code for tokens");
  }

  return response.json() as Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  }>;
}

export async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getSpotifyConfig();

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json() as Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
  }>;
}

export async function fetchTopArtists(
  accessToken: string,
  limit = 5,
  offset = 0,
): Promise<SpotifyArtist[]> {
  const params = new URLSearchParams({
    time_range: "short_term",
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/artists?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch top artists");
  }

  const data = (await response.json()) as TopArtistsResponse;
  return data.items;
}

export async function fetchTopSongs(
  accessToken: string,
  limit = 5,
  offset = 0,
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    time_range: "short_term",
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(`${SPOTIFY_API_BASE}/me/top/tracks?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top songs");
  }

  const data = (await response.json()) as TopTracksResponse;
  return data.items;
}
