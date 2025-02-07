import { type Context, Telegraf } from 'telegraf';
import { env } from '../env_setup/setup.js';
import { tuffoCommands } from './commands.js'
//import { clear } from 'console';

type MyContext = Context;

const bot = new Telegraf(env.NOTIFICATIONS_TELEGRAM_BOT_TOKEN);

async function setCommands() {
    try {
      await bot.telegram.setMyCommands(tuffoCommands, { scope: { type: 'default' } });
      console.log('Comandi impostati con successo!');
    } catch (error) {
      console.error("Errore nell'impostare i comandi:", error);
    }
  }
  
setCommands();

bot.start((ctx) => {
	console.log('Servizio attivato...')
	ctx.reply('Bot JarvisTufBot attivato')
})

/* bot.on("text", (ctx) => {
    const msg = ctx.message;
    ctx.reply("Ciao "+msg.from.first_name+", sono un bot un po' meno stupido!");
    ctx.reply("Ho ricevuto questo: "+msg.text);
    console.log("Messaggio ricevuto: "+msg.text);
  console.log('--------------------');
  }); */

bot.hears('ciao', message=> {
	message.reply('Ci ha salutato')
})

bot.command('posautogek', ctx=> {
    ctx.reply("Ho ricevuto questo: ");
    console.log("Messaggio ricevuto: ");
  console.log('--------------------');
})

bot.command('posautofla', ctx=> {
    ctx.reply("Ho ricevuto questo: ");
    console.log("Messaggio ricevuto: ");
  console.log('--------------------');
})

bot.launch();
console.log('Bot JarvisTufBot avviato');
console.log('--------------------');