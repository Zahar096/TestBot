
const { Telegraf} = require('telegraf')
const { Markup } = require('telegraf/markup');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = process.env.ID;

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'}.\n\n Предложите вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /rek  \n РАЗМЕСТИТЬ НОВОСТЬ /news`))
bot.help((ctx) => ctx.reply(text.commands))

 bot.hears('/rek', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для рекламы /form1'))
 bot.hears('/news', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для новостей /form2'))




const userStage = {}; 
const replyTarget = {};

bot.command('form1', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form1_text';
  ctx.reply('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.\n\n Если после отправки сообщения не пришло уведомление "Заявка на рекламу отправлена!" Попробуйте заново. /form1 ');
});

bot.command('form2', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form2_text';
  ctx.reply('Введите дату новости; \n\n И содержание новости;\n\n  Если после отправки сообщения не пришло уведомление "Новость отправлена!" Попробуйте заново. /form2');
});




bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const stage = userStage[userId];
  const forwardTo = userId;

    if (ctx.message.reply_to_message) {
    const repliedMsg = ctx.message.reply_to_message;
    const replyText = ctx.message.text;
    const groupName = ctx.chat.title || 'Группа';
    const adminMsg = `Ответ на сообщение от администратора: \n\n${replyText}`;
    await bot.telegram.sendMessage(forwardTo, adminMsg);
    delete userStage[userId];
    ctx.reply('Ответ отправлен в чат пользователя');
    return; 
  }

   if (stage === 'waiting_for_form1_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';
    const msg = `Новая рекламная заявка:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    await bot.telegram.sendMessage(targetChatId, msg);
    delete userStage[userId];
    ctx.reply('Заявка на рекламу отправлена! Ждите ответа от администраторов');
  } 
   else if (stage === 'waiting_for_form2_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';
    const msg = `Новость:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    await bot.telegram.sendMessage(targetChatId, msg);
    delete userStage[userId];
    ctx.reply('Новость отправлена! Ждите ответа от администраторов');
  }
});


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






