import json
import logging
import configparser

from urllib.request import Request, urlopen

from telethon import TelegramClient, events

CHATS = [
    -1001699473616, # King Signals
    -1001151289381, # US30 DOW JONES
    -1001251224123, # ORO/DÓLAR
    -1001386141255, # MONEY BAGS
]

# logging.basicConfig(
#     format='[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s',
#     level=logging.INFO,
# )

log_format = '%(asctime)s : %(levelname)s : %(name)s : %(message)s'
formatter = logging.Formatter(log_format)

# Telethon logger
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
telethon_logger = logging.getLogger('telethon.network.mtprotosender')
telethon_logger.setLevel(logging.INFO)
telethon_logger.addHandler(stream_handler)

# Telethonx (this script) logger
file_handler = logging.FileHandler('logs/telethonx.log')
file_handler.setFormatter(formatter)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
print(logger)

URL = 'http://localhost:8000'

def sanitize(text, length=44):
    return text.replace('\n', ' ').encode("ascii", "ignore").decode()[:length].strip()

async def sender(event):
    sender = await event.get_sender()
    result = None
    try:
        return sanitize(f'{sender.id} {sender.title}')
    except Exception:
        name = f'{sender.first_name} {sender.last_name or ""}'
        return sanitize(f'{sender.id} {sender.username}')

def send(message):
    data = json.dumps(message, default=str).encode('utf-8')

    request = Request(URL)
    request.add_header('Content-Type', 'application/json; charset=utf-8')
    request.add_header('Content-Length', len(data))

    print('Sending request to', URL)
    logger.debug('Sending request to %s', URL)

    with urlopen(request, data) as response:
        btext = response.read()
        print('Got response', btext)
        logger.debug('Got response: %s', btext)

config = configparser.ConfigParser()
print(config.read('.config/telegram.ini'))
api_id = config.getint('Telegram', 'api_id')
api_hash = config['Telegram']['api_hash']

client = TelegramClient('logs/telethonx', api_id, api_hash)

# @client.on(events.NewMessage())
@client.on(events.NewMessage(chats=CHATS))
async def my_event_handler(event):
    logger.debug('Got event message %s', event.message.stringify())
    msg = sanitize(event.message.message)
    sndr = await sender(event)
    date = event.message.date
    print('')
    print('Got event:', sndr, f'"{msg}"', date)
    if msg:
        send(
            dict(
                cid = event.message.peer_id.channel_id,
                fid = event.message.from_id,
                msg = event.message.message,
                date = event.message.date,
            )
        )
    # s = await event.get_sender()
    # messages = client.iter_messages(s, ids=event.message.id)
    # async for message in messages:
    #     logger.debug('message %s', message.stringify())

logger.info('Starting %s', client)
client.start()
client.run_until_disconnected()
