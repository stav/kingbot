> Trading involves risk and this software and its developer assume none of it. You're on your own. Do not use this softare to trade. It is for developers only, not for traders; this means you! Stay away from trading, you will lose money.

# K1NGBOT

This is a Deno command line application that

- listens for trade signals from Telegram,
- opens positions on an exchange,
- listens for price events and
- moves the stop-loss for the entire position.

Currently the only exchange supported is XTB's XStation 5 appliance via websocket connections.

## 1.0

The **kingbot** [Proof-of-concept][1] started early October 2021 and within a
month it was moving the _Break-even_ on the exchange by:

1. grouping multi-order positions into "families",
2. listening for _Take-profit_ events,
3. moving the _Stop-loss_ for all orders in the family to slightly better than
the entry.

We began trading with real money in December, the worst month.

## 2.0

Kingbot 2.0 is a rewrite of the code switching the execution engine from
[Node.js][2] to 🦕[Deno][3]. It started in December 2021. The plan is to have it
in production come the spring with the following features:

* monitor [Telegram][4] for _signals_,
* create orders on the exchange,
* move the Break-even.

With these features the bot can theoretically run fully-automatically.

## Components

1. Bot written in TypeScript
2. Telegram client written in Python
3. Log file tools written in Rust

## Installation

The Kingbot uses these components:

* Git - version control (Not needed in future)
* Deno - execution engine runtime
* Velociraptor - script runner

### Install Deno

Deno works on macOS, Linux, and Windows. Deno is a single binary executable. It
has no external dependencies.

On Linux use cURL to download the installation script and run it in a shell:

    curl -fsSL https://deno.land/x/install/install.sh | sh

For other platforms see the [installation page][6].

### Script Runner

Velociraptor makes it easy to run scripts.

Install [Velociraptor][5]:

    deno install -qAn vr https://deno.land/x/velociraptor@1.4.0/cli.ts

Add Bash completion:

    source <(vr completions bash)

### Install the Kingbot

Deno doesn't use any package management files in the project. Modules are cached
when they are first encountered in the code; therefore, the bot doesn't need to
be installed. Just clone the repository:

    git clone git@github.com:stav/kingbot.git
    cd kingbot

### Configuration

Edit the file `.config/exchange.example.yaml` with your real information and save
it as `.config/exchange.yaml`.

Edit the file `.config/telegram.example.yaml` with your real information and save
it as `.config/telegram.yaml`.

## Usage

The Telegram client and server are currently decoupled. The _server_ is able to
be started from the main **deno** application but the _client_ must be started
manually.

### Start the Application

Open a new command-line terminal.

Make sure you are in the `kingbot` directory.

Start the **deno** runtime with [Velociraptor][5].

    vr start

You will spawn an interactive Kingbot interpreter:

    0[-]>

#### The prompt shows:

The exchange account index number currently active:

    0

Zero (0) index is the Telegram connection.

The prompt also shows the login status of current connection
surrounded by square brackets.

Dash (Telegram not connected):

    [-]

Finally, the greater-than input pointer character

    >

#### Start the Telegram Server

The Telegram server listens to HTTP traffic on `localhost` port 8000.

Enter the `connect` command to start the server:

    0[-]> connect
    input "connect" (function) [Function: bound connect]
    Listening to localhost:8000 for { id:123456, name:"Demo", type:"demo" }

    0[C]>

Send EOF (Ctrl-D End-of-file) to exit.

### Start the Telegram Client

Open a second command-line terminal.

Make sure you are in the `kingbot` directory.

Start the **Python** script to listen to configured **Telegram** chats.

    vr pyx

    Connection to 149.154.175.52:443/TcpFull complete!

    Please enter your phone (or bot token): +12345678901

    Disconnection from 149.154.167.51:443/TcpFull complete!
    Connection to 149.154.175.52:443/TcpFull complete!
    Please enter the code you received: 12345
    Signed in successfully

Send Interupt signal (Ctrl-C) to exit.

### Tools

See the [tools documentation][7] to learn how to analyze the log files.

## Development

### Documentation

- XTB          <https://xstation5.xtb.com/>
- xAPI         <http://developers.xstore.pro/documentation/>
- Deno         <https://deno.land/>
- Rhum         <https://drash.land/rhum/>
- Velociraptor <https://velociraptor.run/docs/>

### Coverage

    deno test -A --import-map=denoPaths.json --coverage=coverage

    deno coverage coverage
    deno coverage coverage |grep '100.000%'
    deno coverage coverage |grep 'cover file'

### Dependency Debugging

    # cache dependencies locally
    DENO_DIR=$PWD/deno deno test tests/profits.test.ts -A --import-map=denoPaths.json

    # query the location of the dependency file in question
    DENO_DIR=$PWD/deno deno info --unstable https://deno.land/x/rhum@v1.1.12/src/mock_builder.ts


[1]: https://github.com/stav/xapi
[2]: https://nodejs.org/
[3]: https://deno.land/
[4]: https://telegram.org/
[5]: https://velociraptor.run/
[6]: https://deno.land/manual/getting_started/installation#installation
[7]: https://github.com/stav/kingbot/tree/master/tools#readme
