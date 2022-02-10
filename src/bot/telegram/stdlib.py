from urllib.request import urlopen

with urlopen('http://127.0.0.1:8000') as response:
    print(response, response.read())
