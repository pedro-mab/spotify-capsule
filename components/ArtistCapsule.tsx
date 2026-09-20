"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import type { SpotifyArtist, SpotifyTrack } from "@/lib/spotify";

type ArtistCapsuleProps = {
  artists: SpotifyArtist[];
  songs: SpotifyTrack[];
  monthLabel: string;
};

function getArtistImage(artist: SpotifyArtist) {
  return artist.images[0].url ?? "";
}

function getAlbumImage(track: SpotifyTrack) {
  return track.album.images[0].url ?? "";
}

export function ArtistCapsule({ artists, songs, monthLabel }: ArtistCapsuleProps) {
  const capsuleRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!capsuleRef.current) return;

    try {
      const dataUrl = await toPng(capsuleRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement("a");
      link.download = `spotify-capsule-${monthLabel.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Failed to generate image. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={capsuleRef}
        className="relative h-[640px] w-[360px] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] shadow-2xl"
      >
        
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#ff9900]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#ffffff]/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mx-8 mt-8 flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#1DB954]" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#1DB954]">
                Spotify
              </p>
              <h2 className="text-xl font-bold  text-white">{monthLabel}</h2>
            </div>
          </div>
          
          <div className="flex flex-1 flex-col justify-center gap-16 pb-10">
            <div className="-mx-6 flex items-center justify-around gap-4">
              <img src={getArtistImage(artists[0])} alt={artists[0].name} className="-ml-3 -rotate-10 h-45 w-45 rounded-full shrink-0 object-cover" />
              <div className="w-56 shrink-0">
                <p className="text-sm font-medium uppercase tracking-wider text-white/50">
                  Artistas Mais Ouvidos
                </p>
                {artists.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="flex items-center"
                  >
                    <span className="w-5 text-base font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-white">
                        {artist.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        
            <div className="mx-6 flex items-center justify-around gap-4">              
              <div className="w-56 shrink-0">
                <p className="text-sm font-medium uppercase tracking-wider text-white/50">
                  Músicas Mais Ouvidas
                </p>
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center"
                  >
                    <span className="w-5 text-base font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-white">
                        {song.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <img src={getAlbumImage(songs[0])} alt={songs[0].name} className="-ml-12 rotate-5 h-45 w-45 shrink-0 object-cover" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-full bg-[#1DB954] px-8 py-3 m-6 text-sm font-semibold text-black transition-all hover:bg-[#1ed760] hover:scale-105 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 1 0-1.09-1.03l-2.955 3.129V2.75Z" />
          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
        </svg>
        Baixar Imagem
      </button>
    </div>
  );
}
