import json
import yaml
import asyncio
import logging

from urllib.request import Request, urlopen

from telethon import TelegramClient, events

with open('.config/telegram.yaml') as configfile:
    Telegram = yaml.load(configfile, Loader=yaml.FullLoader)

# logging.basicConfig(
#     format='[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s',
#     level=logging.INFO,
# )

log_format = '%(asctime)s ¦ %(levelname)s ¦ %(name)s ¦ %(message)s'
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

def sanitize(text):
    return text.encode("ascii", "ignore").decode()

def blurb(text, length=44):
    return sanitize(text).replace('\n', ' ')[:length].strip()

async def sender(event):
    sender = await event.get_sender()
    result = None
    try:
        return blurb(f'{sender.id} {sender.title}')
    except Exception:
        name = f'{sender.first_name} {sender.last_name or ""}'
        return blurb(f'{sender.id} {sender.username}')

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

async def run(account):
    id = account['api_id']
    name = account['name']
    hash = account['api_hash']
    session = f"logs/telethonx.{name}.{id}"
    async with TelegramClient(session, id, hash) as client:
        message = f"Starting {client} as {name} {id}"
        logger.info(message)
        print(message)

        # @client.on(events.NewMessage())
        @client.on(events.NewMessage(chats=account['chats']))
        async def my_event_handler(event):
            logger.debug('Got event message %s', event.message.stringify())
            msg = blurb(event.message.message)
            sndr = await sender(event)
            date = event.message.date
            print('')
            print('Got event:', sndr, f'"{msg}"', date)
            if msg:
                send(
                    dict(
                        cid = event.message.peer_id.channel_id,
                        fid = event.message.from_id,
                        date = event.message.date,
                        eindex = account['exchange_index'],
                        msg = sanitize(event.message.message),
                    )
                )
            # s = await event.get_sender()
            # messages = client.iter_messages(s, ids=event.message.id)
            # async for message in messages:
            #     logger.debug('message %s', message.stringify())

        await client.start()
        await client.run_until_disconnected()

async def main():
    await asyncio.gather(*[ run(account) for account in Telegram['Accounts'] ])

asyncio.run(main())
