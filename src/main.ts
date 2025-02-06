import { type Context, Telegraf } from 'telegraf';
import { env } from '../env_setup/setup.js';

type MyContext = Context;


const bot = new Telegraf(env.NOTIFICATIONS_TELEGRAM_BOT_TOKEN);

bot.on("message", (ctx) => {
  ctx.reply("Ciao, sono un bot molto stupido!");
});

bot.launch();