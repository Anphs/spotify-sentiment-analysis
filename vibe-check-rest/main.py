from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import time

app = FastAPI()

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
  time.sleep(5) # TODO: REMOVE
  return {"vibe": "Sad"}