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
    return sanitize(text).replace('\n', ' ').replace('  ', ' ')[:length].strip()

async def sender(event):
    s = await event.get_sender()
    print('SENDER', s)
    return blurb(f"{s.id} {getattr(s, 'first_name', '')} {getattr(s, 'last_name', '')} {getattr(s, 'title', '')} {getattr(s, 'username', '')}".replace('  ', ' ').strip())

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
        starting = f"Starting {client} as {name} {id}"
        logger.info(starting)
        print(starting)

        # @client.on(events.NewMessage())
        @client.on(events.NewMessage(chats=account['chats']))
        async def my_event_handler(event):
            logger.debug('Got event message %s', event.message.stringify())
            print('')
            msg = blurb(event.message.message)
            sndr = await sender(event)
            date = event.message.date
            print('Got event: from', sndr, f'"{msg}"', date)
            if msg:
                message = sanitize(event.message.message)
                cid = event.message.peer_id.channel_id
                forward = account.get('forwards', {}).get(cid, False)
                if forward:
                    entity = await client.get_entity(forward)
                    forwarding = f"Forwarding message from {cid} to {entity.id} {getattr(entity, 'title')}"
                    print(forwarding)
                    logger.info(forwarding)
                    await client.send_message(entity=entity, message=message)
                else:
                    send(
                        dict(
                            cid = cid,
                            fid = event.message.from_id,
                            date = event.message.date,
                            eindex = account['exchange_index'],
                            msg = message,
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
