from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from genius import GeniusWrapper
from model import ModelWrapper
import os
import string

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
vibe_prompt = 'You are an assistant that analyzes song lyrics. Respond with exactly one word for the emotional tone of the song. Do not explain. Some examples are melancholic, dreamy, energetic, and moody.'
vibe_model = ModelWrapper(model_name, vibe_prompt)

# Setup Result Cache
cache = {}

# Application Endpoints
@app.get('/vibe')
async def vibe(name: str, artists: str):
  # return cached result, if any
  cache_key = '%s %s' % (name, artists)
  if cache.get(cache_key) != None:
    return cache[cache_key]
  
  # Get lyrics using Genius API
  lyrics = ''
  try:
    lyrics = genius.search_lyrics(artists, name, include_headers=False)
    print('Retrieved lyrics for "%s" by "%s"' % (name, artists))
  except:
    print('Failed to retrieve lyrics for "%s" by "%s"' % (name, artists))
    raise HTTPException(status_code=404, detail='Song not found')

  # extract 'vibe' from lyrics using Ollama model
  vibe_response = vibe_model.get_response(lyrics)
  vibe = vibe_response.strip().split()[0].strip(string.punctuation)     # extract first word of response
  vibe = vibe[0].upper() + vibe[1:].lower()                             # format as camel case
  print('Extracted vibe "%s"' % vibe)
  
  # add response to cache
  response = { 'vibe': vibe }
  cache[cache_key] = response

  return response