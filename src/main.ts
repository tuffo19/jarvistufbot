import { Context, Telegraf } from 'telegraf';
import { getData, setData } from './data.js';
import { env } from '../env_setup/setup.js';
import { tuffoCommands } from './commands.js'
//import { clear } from 'console';

type MyContext = Context;

const bot = new Telegraf(env.NOTIFICATIONS_TELEGRAM_BOT_TOKEN);
let chatsId: number[] = [];

chatsId = (await getData('chatsId')) ?? [];

async function setCommands() {
    try {
      await bot.telegram.setMyCommands(tuffoCommands, { scope: { type: 'default' } });
      console.log('Comandi impostati con successo!');
    } catch (error) {
      console.error("Errore nell'impostare i comandi:", error);
    }
  }
  
setCommands();

bot.start(async (ctx) => {
  if (ctx.from?.id && !chatsId.includes(ctx.from?.id)) {
    chatsId.push(ctx.from?.id);

    console.log('--------------------');
    console.log(
      `New user: ${ctx.from?.first_name} ${ctx.from?.last_name ?? ''}`
    );

    await setData('chatsId', chatsId);
    const msg = ctx.message;
    console.log('Servizio di notifica attivato per utente '+msg.from.first_name+', chat_id: '+chatsId);
    ctx.reply("Ciao "+msg.from.first_name+", bot JarvisTufBot abilitato a inviare notifiche. Per fermarlo lancia comando /stop");
  }
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

bot.command('stop', ctx=> {
  //cancellare la chat_id e avvisare il cliente
})



bot.launch();
console.log('Bot JarvisTufBot avviato');
console.log('--------------------');

//avviso tutte le chatId connesse
for (const chatId of chatsId) {
  console.log("Sending launch message to chatId:"+chatId)
  void bot.telegram.sendMessage(chatId,`💥Bot JarvisTufBot avviato💥.\n<i>Da questo momento le notifiche sono attive.</i>`,
    {
    parse_mode: 'HTML',
    }
  )
  .catch((error) => {
    console.error(error);
  });
}