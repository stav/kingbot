import json
from pprint import pprint
from urllib.request import urlopen

with urlopen('http://127.0.0.1:1778') as response:
    print('response', response)
    response_content = response.read()
    print('response', response_content)
    json_response = json.loads(response_content)
    pprint(json_response)
