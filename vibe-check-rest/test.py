from dotenv import load_dotenv
from genius import GeniusAPI

load_dotenv()
genius = GeniusAPI()
lyrics = genius.search_lyrics('Sabrina Carpenter', 'Feather')
print(lyrics)