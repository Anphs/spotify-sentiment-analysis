from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from genius import GeniusWrapper
from model import ModelWrapper
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
model_name = 'mistral'
lyrics_prompt = 'Analyze the following lyrics and come up with a 1-word descriptor of the overall song vibe: "%s".'
ollama = ModelWrapper(model_name, lyrics_prompt)

# Application Endpoints
@app.get('/vibe')
async def vibe(name: str, artists: str):
  # Get lyrics using Genius API
  lyrics = ''
  try:
    lyrics = genius.search_lyrics(artists, name, include_headers=False)
  except:
    raise HTTPException(status_code=404, detail='Song not found')
  
  # extract 'vibe' from lyrics using Ollama model
  vibe_response = ollama.get_lyrics_vibe(lyrics)
  return vibe_response.model_dump()