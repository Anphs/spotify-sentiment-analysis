importScripts("pkce.js");

const redirectUri = chrome.identity.getRedirectURL("spotify");
const scope = "user-read-playback-state user-read-currently-playing";

async function getConfig() {
  const res = await fetch(chrome.runtime.getURL("config.json"));
  return res.json();
}

chrome.runtime.onMessage.addListener(async (message) => {
  const { clientId } = await getConfig();

  if (message.type === "login") {
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

          const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          });

          const tokenData = await res.json();
          const expiryTime = Date.now() + tokenData.expires_in * 1000;

          chrome.storage.local.set({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            token_expiry: expiryTime,
          });
        });
      }
    );
  }
});
