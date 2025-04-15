# Spotify Sentiment Analysis

## Overview

This project aims to develop a Natural Language Processing (NLP) classifier to determine trends by analyzing a user's current playing song on Spotify. By leveraging APIs such as Spotify and Genius, the classifier retrieves song titles, artists, and lyrics to perform sentiment analysis and classify the overall "vibe" of the songs.

### Features

- Spotify Integration: Uses the Spotify API to fetch song titles and artists from a user's selected playlist.

- Lyrics Retrieval: Retrieves song lyrics from the Genius API for the selected songs.

- Sentiment Analysis: Utilizes pre-trained large language models (LLMs) via Ollama for sentiment analysis to classify the mood of each song into categories like happy, sad, energetic, calm, or romantic.

## Frontend

### Spotify API Setup

1. Login to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Set the redirect URI to https://**REPLACE_WITH_CHROME_EXTENSION_ID**.chromiumapp.org/spotify

Note the `Client ID`.

### Extension Setup

1. Edit `config.json` and set the `clientId` to be the one provided by Spotify
2. Open [chrome://extensions/](chrome://extensions/)
3. Enable **Developer mode**
4. Click on **Load unpacked** and select the `vibe-check-extension` folder

Note the `Extension ID`.

## Backend

### Prerequisites

This project reqires python version 3.9 or later.

1. Add the `Extension ID` provided by Chrome to the environment variable `CHROME_EXTENSION_ID`
2. Install python dependencies (`pip install -r vibe-check-rest/requirements.txt`)

### Genius API Setup

1. Login to [Genius](https://genius.com/signup_or_login)
2. Create an app
3. Generate an access token
4. Add the access token in the environment variable `GENIUS_ACCESS_TOKEN`

### Ollama Setup

1. Download Ollama for your operating system [here](https://ollama.com/download)
2. Use the executable file to install Ollama
3. Start an Ollama server (`ollama serve`)

### Testing

The API, `vibe-check-rest`, is built using _fastapi_. To run a development server, run the following command:

```
python -m fastapi dev vibe-check-rest/main.py
```

This will start a development server, which can be accessed at http://127.0.0.1/8000.
