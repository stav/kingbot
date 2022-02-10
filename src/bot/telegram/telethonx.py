import json
import logging
import configparser

from urllib.request import Request, urlopen

from telethon import TelegramClient, events

logging.basicConfig(format='[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s',
                    level=logging.INFO)

url = 'http://localhost:8000'

config = configparser.ConfigParser()
print(config.read('.config/telegram.ini'))
api_id = config.getint('Telegram', 'api_id')
api_hash = config['Telegram']['api_hash']

client = TelegramClient('telethonx', api_id, api_hash)

def show(entity):
    try:
        return f'{entity.id} {entity.title}'
    except Exception:
        name = f'{entity.first_name} {entity.last_name or ""}'
        return f'{entity.id} {entity.username} '

def message(event):
    m = event.message.message
    try:
        return m.replace('\n', ' ').encode("ascii", "ignore").decode()[:44].strip()
    except Exception:
        return "XXXX"

def send(message):
    data = json.dumps(message, default=str).encode('utf-8')

    request = Request(url)
    print('Tx send request:', request)
    request.add_header('Content-Type', 'application/json; charset=utf-8')
    request.add_header('Content-Length', len(data))

    with urlopen(request, data) as response:
        print('Tx got response', response.read())

# @client.on(events.NewMessage())
@client.on(events.NewMessage(chats=[-1001253919762, -1001410749168, -1001386141255, -1001151289381, -1001699473616]))
async def my_event_handler(event):
    sender = await event.get_sender()
    msg = message(event)
    print()
    print('Tx got event:', show(sender), msg, event.message.date)
    if msg:
        send(
            dict(
                cid = event.message.peer_id.channel_id,
                fid = event.message.from_id,
                msg = event.message.message,
                date = event.message.date,
            )
        )
    # print(event.stringify())

client.start()
client.run_until_disconnected()
