import { Context, Telegraf } from 'telegraf';
import { getData, setData } from './data.js';
import { env } from '../env_setup/setup.js';
import { tuffoCommands } from './commands.js'
import { logHelper } from './logger.js';
import { CarPositionRequest } from '../env_setup/types.js';

type MyContext = Context;

const bot = new Telegraf(env.NOTIFICATIONS_TELEGRAM_BOT_TOKEN);
let chatsId: number[] = [];

chatsId = (await getData('chatsId')) ?? [];

async function setCommands() {
    try {
      await bot.telegram.setMyCommands(tuffoCommands, { scope: { type: 'default' } });
      logHelper.info('Comandi impostati con successo!');
    } catch (error) {
      logHelper.error("Errore nell'impostare i comandi:", error);
    }
  }
  
setCommands();

bot.start(async (ctx) => {
  if (ctx.from?.id && !chatsId.includes(ctx.from?.id)) {
    chatsId.push(ctx.from?.id);

    logHelper.info('--------------------');
    logHelper.info(
      `New user: ${ctx.from?.first_name} ${ctx.from?.last_name ?? ''}`
    );

    await setData('chatsId', chatsId);
    const msg = ctx.message;
    logHelper.info('Servizio di notifica attivato per utente '+msg.from.first_name+', chat_id: '+ctx.from?.id);
    ctx.reply("Ciao "+msg.from.first_name+", bot JarvisTufBot abilitato a inviare notifiche. Per fermarlo lancia comando /stop");
  }
})

bot.help((ctx) => {
  ctx.reply('Io sono JarvisTufBot, un agente AI che ti permette di inviare richieste e ricevere notifiche da Tuffo in persona.')
})


bot.command('posautogek', ctx=> {
    ctx.reply("Ho ricevuto questo: ");
    logHelper.info("Messaggio ricevuto: ");
  logHelper.info('--------------------');
})

bot.command('posautofla', ctx=> {
    ctx.reply("Ho ricevuto questo: ");
    logHelper.info("Messaggio ricevuto: ");
  logHelper.info('--------------------');
})

bot.command('stop', ctx=> {
  //cancellare la chat_id e avvisare il cliente
})

bot.launch();
logHelper.info('Bot JarvisTufBot avviato');
logHelper.info('--------------------');

//avviso tutte le chatId connesse
logHelper.info("List of chatsId: {"+chatsId+"}");
for (const chatId of chatsId) {
  logHelper.info("Sending launch message to chatId: "+chatId)
  void bot.telegram.sendMessage(chatId,`💥Bot JarvisTufBot avviato💥.\n<i>Da questo momento le notifiche sono attive.</i>`,
    {
    parse_mode: 'HTML',
    }
  )
  .catch((error) => {
    logHelper.error("Errore nell'invio msg di avvio a tutte le chatId abbonate",error);
  });
}


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))