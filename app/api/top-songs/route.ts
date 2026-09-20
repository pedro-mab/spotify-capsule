import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/auth";
import { fetchTopSongs } from "@/lib/spotify";

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const songs = await fetchTopSongs(accessToken, 5);
    return NextResponse.json({ songs });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch top artists" },
      { status: 500 },
    );
  }
}
