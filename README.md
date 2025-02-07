# jarvistufbot
my first telegram bot

## Installation
### Prerequisites
- [Node.js](https://nodejs.org) (>=20.x.x)

### Clone the Repository
```bash
git clone https://github.com/Achaak/toogoodtogo-bot.git
cd toogoodtogo-bot/
```

### Configure Environment Variables
1. Make a copy of the sample environment file and enter your parameters:
   ```bash
   cp .env .env.local
   ```
2. Open `.env.local` in a text editor and fill in the required information.

### Install Dependencies
```bash
pnpm install
```

### Build the Project
```bash
pnpm run build
```

### Start the Application
```bash
pnpm start
```

## Update
To update the application, follow these steps:

1. Get the latest files:
   ```bash
   git pull
   ```

2. Install any new dependencies:
   ```bash
   pnpm install
   ```

3. Rebuild the project:
   ```bash
   pnpm run build
   ```
### Telegram
  To set up Telegram notifications, access the `.env.local` file in a text editor and provide the necessary value for the `NOTIFICATIONS_TELEGRAM_ENABLED` parameter.

  To configure the bot, open the `.env.local` file in a text editor and specify the value for the `NOTIFICATIONS_TELEGRAM_BOT_TOKEN` parameter.

  #### Creating a Telegram Bot

  1. Open a Telegram chat with [BotFather](https://t.me/BotFather) and enter the **/start** command.

  2. Select the **/newbot** command and follow the instructions to create a new bot. Take note of the token access provided.

  3. Once your bot is created, multiple users can use it to receive notifications about their favorite stocks.

  4. To start receiving notifications, send the **/start** command in your bot's conversation.

  #### Commands
  - **/start**: Starts Telegram notifications
  - **/stop**: Stops Telegram notifications
  - **/help**: Provides a list of usable commands
</details>