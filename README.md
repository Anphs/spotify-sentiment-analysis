# Spotify Sentiment Analysis

## Overview

This project aims to develop a Natural Language Processing (NLP) classifier to determine trends by analyzing a user's Spotify playlist. By leveraging APIs such as Spotify and Genius, the classifier retrieves song titles, artists, and lyrics to perform sentiment analysis and classify moods of the songs. The goal is to categorize the mood of each song in a playlist and provide insights into the overall mood trends in the playlist.

### Features

- Spotify Integration: Uses the Spotify API to fetch song titles and artists from a user's selected playlist.

- Lyrics Retrieval: Retrieves song lyrics from the Genius API for the selected songs.

- Sentiment Analysis: Utilizes pre-trained large language models (LLMs) for sentiment analysis to classify the mood of each song into categories like happy, sad, energetic, calm, or romantic.

## Development

### Backend Setup

This project reqires python version 3.9 or later. Once python has been setup, you can install project dependencies using the following command:

```
pip install -r vibe-check-rest/requirements.txt
```

### Backend Testing

The API, `vibe-check-rest`, is built using _fastapi_. To run a development server, simply run the following command:

```
python -m fastapi dev vibe-check-rest/main.py
```

This will start a development server, which can be accessed at http://127.0.0.1/8000.

### Extension Setup

The chrome extension can be loaded at [chrome://extensions/](chrome://extensions/). With developer mode enabled, you can load `vibe-check-extension` as an unpacked extension.

### Extension Testing

The extension only runs when the web browser is on a page within the Spotify domain.
