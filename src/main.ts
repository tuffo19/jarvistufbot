import { Telegraf } from "telegraf";

const bot = new Telegraf("<INSERITE IL VOSTRO TOKE QUI>");

bot.on("message", (ctx) => {
  ctx.reply("Ciao, sono un bot molto stupido!");
});

bot.launch();