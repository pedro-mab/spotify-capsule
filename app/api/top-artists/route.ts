import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/auth";
import { fetchTopArtists } from "@/lib/spotify";

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const artists = await fetchTopArtists(accessToken, 5);
    return NextResponse.json({ artists });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch top artists" },
      { status: 500 },
    );
  }
}
