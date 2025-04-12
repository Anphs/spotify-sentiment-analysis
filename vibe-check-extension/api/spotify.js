import { generateCodeVerifierAndChallenge } from "./pkce.js";

const redirectUri = chrome.identity.getRedirectURL("spotify");

async function fetchConfig() {
  const url = chrome.runtime.getURL("config.json");
  const res = await fetch(url);
  return res.json();
}

async function fetchToken(body) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  return await res.json();
}

export async function login() {
  const { clientId, scope } = await fetchConfig();
  const { verifier, challenge } = await generateCodeVerifierAndChallenge();

  chrome.storage.local.set({ code_verifier: verifier });

  const authUrl =
    `https://accounts.spotify.com/authorize?client_id=${clientId}` +
    `&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge_method=S256&code_challenge=${challenge}` +
    `&scope=${encodeURIComponent(scope)}`;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    async (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Authentication Error:", chrome.runtime.lastError);
        return;
      }

      const code = new URL(redirectUrl).searchParams.get("code");

      chrome.storage.local.get("code_verifier", async ({ code_verifier }) => {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier,
        });

        const tokenData = await fetchToken(body);

        chrome.storage.local.set({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expiry: Date.now() + tokenData.expires_in * 1000,
        });
      });
    }
  );
}

export async function refresh(refresh_token, callback) {
  const { clientId } = await fetchConfig();

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
    client_id: clientId,
  });

  const newTokenData = await fetchToken(body);

  chrome.storage.local.set(
    {
      access_token: newTokenData.access_token,
      token_expiry: Date.now() + newTokenData.expires_in * 1000,
    },
    () => {
      callback(newTokenData.access_token);
    }
  );
}

export async function fetchCurrentlyPlaying(token) {
  return await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
