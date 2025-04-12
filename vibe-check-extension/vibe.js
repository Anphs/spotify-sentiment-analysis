export async function fetchVibe(track) {
  return await fetch(
    "http://127.0.0.1:8000/vibe?" +
      new URLSearchParams({
        name: track.name,
        artists: track.artists,
      }).toString()
  );
}
