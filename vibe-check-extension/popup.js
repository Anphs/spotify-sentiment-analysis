import { fetchCurrentlyPlaying, refresh } from "./spotify.js";
import { fetchVibe } from "./vibe.js";

async function refreshTokenIfNeeded(callback) {
  chrome.storage.local.get(
    ["access_token", "refresh_token", "token_expiry"],
    async (data) => {
      if (!data.refresh_token) {
        return callback(null);
      }

      if (Date.now() > data.token_expiry) {
        await refresh(data.refresh_token, callback);
      } else {
        callback(data.access_token);
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");
  const trackInfo = document.getElementById("track-info");

  loginBtn.style.display = "none";
  trackInfo.style.display = "none";

  refreshTokenIfNeeded(async (token) => {
    if (!token) {
      showLogin("Login with Spotify");
      return;
    }

    const res = await fetchCurrentlyPlaying(token);

    if (!res.ok) {
      showLogin("Re-authenticate Spotify");
      return;
    }

    const data = await res.json();

    if (data && data.item) {
      const track = data.item;
      track["artists"] = track.artists.map((a) => a.name).join(", ");

      showTrackInfo(track);

      const vibe_res = await fetchVibe(track);

      const { vibe } = await vibe_res.json();
      showVibe(vibe);
    } else {
      showLogin("Nothing playing");
    }
  });

  function showLogin(text) {
    loginBtn.textContent = text;
    loginBtn.style.display = "block";
    trackInfo.style.display = "none";
  }

  function showTrackInfo(track) {
    document.getElementById("album-art").src = track.album.images[0].url;
    document.getElementById("title").textContent = track.name;
    document.getElementById("artist").textContent = track.artists;
    trackInfo.style.display = "block";
    loginBtn.style.display = "none";
  }

  function showVibe(vibe) {
    const vibeResult = document.getElementById("vibe-result");
    if (vibe) {
      vibeResult.textContent = vibe;
    } else {
      vibeResult.textContent = "Failed to fetch vibe";
    }
    vibeResult.classList.add("no-animation");
  }

  loginBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "login" });
  });
});
