from fastapi import FastAPI, HTTPException
from genius import GeniusAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import time

app = FastAPI()
genius = GeniusAPI()

with open("config.json", 'r') as config_file:
  config_json = json.load(config_file)

  extension_id = config_json["extensionId"]
  extension_origin = "chrome-extension://" + extension_id

  app.add_middleware(
      CORSMiddleware,
      allow_origins=[extension_origin],
      allow_methods=["*"],
      allow_headers=["*"],
  )


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