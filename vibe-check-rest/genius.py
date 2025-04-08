from bs4 import BeautifulSoup
import os
import re
import requests

class GeniusAPI:
  API_URL = 'https://api.genius.com'
  HTML_URL = 'https://genius.com'
  
  def __init__(self):
    # Try to get the access token from the environment
    self.access_token = os.getenv('GENIUS_ACCESS_TOKEN')
    if not self.access_token:
      raise ValueError('GENIUS_ACCESS_TOKEN not found in environment variables.')
    
    # Set up request session with authorization header
    self.session = requests.Session()
    self.session.headers.update({
      'Authorization': f'Bearer {self.access_token}',
    })
    
  def search(self, query, per_page=1):
    endpoint = f'{self.API_URL}/search'
    params = {
      'q': query,
      'per_page': per_page,
    }
    response = self.session.get(endpoint, params=params)
    response.raise_for_status()
    return response.json()
    
  def search_song(self, artist, song):
    response = self.search(f'{artist} {song}', per_page=1)
    meta = response['response']['hits'][0]
    if (meta['index'] != 'song'):
      raise ValueError('The search result is not a valid song.')
    return meta['result']
  
  def search_lyrics(self, artist, song, include_headers=False):
    # Get song lyrics from the web
    song_meta = self.search_song(artist, song)
    endpoint = f'{self.HTML_URL}{song_meta["path"]}'
    response = self.session.get(endpoint)
    response.raise_for_status()
    
    # Scrape response for lyrics
    html = BeautifulSoup(response.text.replace('<br/>', '\n'), 'html.parser')
    divs = html.find_all('div', class_=re.compile(r'Lyrics__Container'))
    divs[0].find(class_=re.compile(r'LyricsHeader__Container')).decompose()
    if divs is None or len(divs) <= 0:
      return None
    
    # Format lyrics as plain text and remove unwanted information
    lyrics = '\n'.join([div.get_text() for div in divs])    # format as a string
    if (not include_headers):
      lyrics = re.sub(r'(\[.*?\])*', '', lyrics)              # remove section headers
      lyrics = re.sub('\n{2}', '\n', lyrics).strip('\n')      # remove extra newlines
    
    return lyrics