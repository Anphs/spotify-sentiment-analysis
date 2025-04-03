# Spotify Sentiment Analysis

## Overview

This project aims to develop a Natural Language Processing (NLP) classifier to determine trends by analyzing a user's Spotify playlist. By leveraging APIs such as Spotify and Genius, the classifier retrieves song titles, artists, and lyrics to perform sentiment analysis and classify moods of the songs. The goal is to categorize the mood of each song in a playlist and provide insights into the overall mood trends in the playlist.

### Features

- Spotify Integration: Uses the Spotify API to fetch song titles and artists from a user's selected playlist.

- Lyrics Retrieval: Retrieves song lyrics from the Genius API for the selected songs.

- Sentiment Analysis: Utilizes pre-trained large language models (LLMs) for sentiment analysis to classify the mood of each song into categories like happy, sad, energetic, calm, or romantic.

## Development

### Setup

This project reqires python version 3.9 or later. Once python has been setup, you can install project dependencies using the following command:

```
pip install -r requirements.txt
```

### Testing

The API for this project is built using _fastapi_. To run a development server, simply run the following command:

```
python -m fastapi dev sentimentapi/main.py
```

This will start a development server, which can be accessed at http://127.0.0.1/8000.