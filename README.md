# Spotify Sentiment Analysis

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Demo](#demo)
- [Frontend Setup](#frontend-setup)
  - [Spotify API Configuration](#spotify-api-configuration)
  - [Chrome Extension Installation](#chrome-extension-installation)
- [Backend Setup](#backend-setup)
  - [Prerequisites](#prerequisites)
  - [Genius API Configuration](#genius-api-configuration)
  - [Ollama Setup](#ollama-setup)
  - [Running the Backend](#running-the-backend)

## Overview

This project uses Natural Language Processing (NLP) to analyze a user's currently playing songs on Spotify and determine their emotional tone. By leveraging the Spotify and Genius APIs, the app retrieves song titles, artists, and lyrics, then uses sentiment analysis via large language models (LLMs) to classify the overall "vibe" of each song.

## Key Features

- **Spotify Integration**: Connects to the Spotify API to fetch the currently playing song and artist from  a user's playlist.

- **Lyrics Retrieval**: Uses the Genius API to pull song lyrics based on title and artist information.

- **Sentiment Analysis**: Employs pre-trained LLMs (served via Ollama) to classify songs into moods like *happy*, *sad*, *energetic*, *calm*, or *romantic*.

## Demo

Coming soon!

## Frontend Setup

### Spotify API Configuration

1. Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set the redirect URI to https://**REPLACE_WITH_CHROME_EXTENSION_ID**.chromiumapp.org/spotify
4. Note the `Client ID`.

### Chrome Extension Installation

1. Edit `config.json` and set `clientId` to your Spotify `Client ID`
2. Go to [chrome://extensions/](chrome://extensions/)
3. Enable **Developer mode**
4. Click on **Load unpacked** and select the `vibe-check-extension` folder
5. Note the `Extension ID` shown in the extension details

## Backend Setup

### Prerequisites

This project reqires python version 3.9 or later.

1. Set the `CHROME_EXTENSION_ID` as an environment variable
2. Install python dependencies 

```
pip install -r vibe-check-rest/requirements.txt
```

### Genius API Configuration

1. Sign up or log in to [Genius](https://genius.com/signup_or_login)
2. Create an app and generate an access token
3. Add the access token as an environment variable: `GENIUS_ACCESS_TOKEN`

### Ollama Setup

1. [Download Ollama](https://ollama.com/download) and install it for your OS
2. Start the Ollama server

```
ollama serve
```

### Running the Backend

The backend is builg with **FastAPI**. To start the development server:

```
python -m fastapi dev vibe-check-rest/main.py
```

You can directly access the server at http://127.0.0.1/8000.
