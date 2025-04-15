export async function fetchVibe(track) {
  return await fetch(
    "http://127.0.0.1:8000/vibe?" +
      new URLSearchParams({
        name: track.name,
        artists: track.artists,
      }).toString()
  )
    .then(async (response) => {
      const json = await response.json();
      if (!json.vibe) {
        throw new Error("No vibe found");
      }
      return json.vibe;
    })
    .catch((error) => {
      console.error("Error fetching song vibe: ", error);
      return "Failed to fetch vibe";
    });
}
