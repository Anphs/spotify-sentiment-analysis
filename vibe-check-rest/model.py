from pydantic import BaseModel
from ollama import generate

class VibeResponse(BaseModel):
  vibe: str

class ModelWrapper:
  def __init__(self, model_name, prompt, seed=1973):
    self.model_name = model_name
    self.options = { 'seed': seed }
    self.prompt = prompt + ' Respond using JSON.'
    
  def get_lyrics_vibe(self, lyrics):
    # Generate prompt using given lyrics
    prompt = (self.prompt % lyrics)
        
    # Get output from model and format as VibeResponse object
    output = generate(model=self.model_name, options=self.options, prompt=prompt, format=VibeResponse.model_json_schema())
    return VibeResponse.model_validate_json(output.response)