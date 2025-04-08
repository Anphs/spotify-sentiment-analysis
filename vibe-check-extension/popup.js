async function getConfig() {
  const res = await fetch(chrome.runtime.getURL("config.json"));
  return res.json();
}

async function refreshTokenIfNeeded(callback) {
  chrome.storage.local.get(
    ["access_token", "refresh_token", "token_expiry"],
    async (data) => {
      if (!data.refresh_token) return callback(null);

      if (Date.now() > data.token_expiry) {
        // Refresh needed
        const { clientId } = await getConfig();
        const body = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: data.refresh_token,
          client_id: clientId,
        });

        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        const newTokenData = await res.json();
        const newExpiry = Date.now() + newTokenData.expires_in * 1000;

        chrome.storage.local.set(
          {
            access_token: newTokenData.access_token,
            token_expiry: newExpiry,
          },
          () => {
            callback(newTokenData.access_token);
          }
        );
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

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      showLogin("Re-authenticate Spotify");
      return;
    }

    const data = await res.json();

    if (data && data.item) {
      showTrackInfo(data);

      const vibe_res = await fetch(
        "http://127.0.0.1:8000/vibe?" +
          new URLSearchParams({
            name: data.item.name,
            artists: data.item.artists.map((a) => a.name).join(", "),
          }).toString()
      );

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

  function showTrackInfo(data) {
    document.getElementById("album-art").src = data.item.album.images[0].url;
    document.getElementById("title").textContent = data.item.name;
    document.getElementById("artist").textContent = data.item.artists
      .map((a) => a.name)
      .join(", ");
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
