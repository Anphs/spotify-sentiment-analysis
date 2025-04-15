from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from genius import GeniusWrapper
from ollama import OllamaWrapper
import time
import os

# Setup API application
load_dotenv()
extension_id = os.getenv('CHROME_EXTENSION_ID')
extension_origin = 'chrome-extension://' + extension_id

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=[extension_origin],
  allow_methods=['*'],
  allow_headers=['*'],
)

# Setup Genius wrapper
genius = GeniusWrapper()

# Setup Ollama wrapper
ollama = OllamaWrapper()

# Application Endpoints
@app.get("/vibe")
async def vibe(name: str, artists: str):
  # Get lyrics using Genius API
  lyrics = ""
  try:
    lyrics = genius.search_lyrics(artists, name, include_headers=False)
  except:
    raise HTTPException(status_code=404, detail="Song not found")
  
  # TODO: extract 'vibe' from lyrics using Ollama model
  print(lyrics)
  
  time.sleep(5) # TODO: REMOVE
  
  return {"vibe": "Sad"}