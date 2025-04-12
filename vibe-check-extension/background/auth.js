import { login } from "../api/spotify.js";

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "login") {
    await login();
  }
});
