from pydantic import BaseModel
from ollama import chat

class ModelWrapper:
  def __init__(self, model_name, prompt, seed=1973):
    self.model_name = model_name
    self.prompt = prompt
    self.options = { 'seed': seed }
    
  def get_response(self, user_prompt):
    messages = [
      {
        'role': 'system',
        'content': self.prompt,  
      },
      {
        'role': 'user',
        'content': user_prompt,
      },
    ]
    
    raw_response = chat(model=self.model_name, messages=messages, options=self.options)
    return raw_response.message.content