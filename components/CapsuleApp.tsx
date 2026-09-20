"use client";

import { useEffect, useState } from "react";
import { ArtistCapsule } from "./ArtistCapsule";
import type { SpotifyArtist, SpotifyTrack } from "@/lib/spotify";

type CapsuleAppProps = {
  isAuthenticated: boolean;
  error?: string | null;
};

function getMonthLabel() {
  const date = new Date();
  date.setMonth(date.getMonth());
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  const year = date.toLocaleDateString("pt-BR", { year: "numeric" });

  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

const ERROR_MESSAGES: Record<string, string> = {
  auth_denied: "You denied access to Spotify. Please try again.",
  invalid_state: "Authentication failed due to a security check. Please try again.",
  token_exchange: "Failed to connect to Spotify. Please try again.",
};

export function CapsuleApp({ isAuthenticated, error }: CapsuleAppProps) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [songs, setSongs] = useState<SpotifyTrack[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(isAuthenticated);
  const [loadingSongs, setLoadingSongs] = useState(isAuthenticated);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/top-artists")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.artists.length === 0) {
          setFetchError(
            "No top artists found for this month. Listen to more music on Spotify and check back later!",
          );
        } else {
          setArtists(data.artists);
        }
      })
      .catch(() => {
        setFetchError("Something went wrong fetching your top artists.");
      })
      .finally(() => setLoadingArtists(false));
    
    fetch("/api/top-songs")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.songs.length === 0) {
          setFetchError(
            "No top songs found for this month. Listen to more music on Spotify and check back later!",
          );
        } else {
          setSongs(data.songs);
        }
      })
      .catch(() => {
        setFetchError("Something went wrong fetching your top songs.");
      })
      .finally(() => setLoadingSongs(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954]/10">
            <svg viewBox="0 0 24 24" className="h-10 w-10 fill-[#1DB954]" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Spotify Capsule
          </h1>
          <p className="max-w-md text-lg text-white/60">
            Generate a shareable image of your top 5 artists from this month.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {ERROR_MESSAGES[error] ?? "An error occurred. Please try again."}
          </p>
        )}

        {isLocalhost && (
          <p className="max-w-md rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            Open this app at{" "}
            <a href="http://127.0.0.1:3000" className="underline">
              http://127.0.0.1:3000
            </a>{" "}
            instead of localhost. Spotify requires the loopback IP for OAuth.
          </p>
        )}

        <a
          href="/api/auth/login"
          className="flex items-center gap-3 rounded-full bg-[#1DB954] px-8 py-4 text-base font-semibold text-black transition-all hover:bg-[#1ed760] hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Connect with Spotify
        </a>
      </div>
    );
  }

  if (loadingArtists || loadingSongs) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1DB954]/20 border-t-[#1DB954]" />
        <p className="text-white/60">Loading your capsule...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="max-w-md text-white/60">{fetchError}</p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-full border border-white/20 px-6 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white"
          >
            Log out and try again
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full max-w-[420px] items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Retrospectiva Mensal</h1>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-white/40 transition-colors hover:text-white/70"
          >
            Log out
          </button>
        </form>
      </div>
      <ArtistCapsule artists={artists} songs={songs} monthLabel={getMonthLabel()} />
    </div>
  );
}
