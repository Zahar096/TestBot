
const { Telegraf} = require('telegraf')
const { Markup } = require('telegraf/markup');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'}.\n\n Предложиту вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /rek  \n РАЗМЕСТИТЬ НОВОСТЬ /news`))
bot.help((ctx) => ctx.reply(text.commands))

 bot.hears('/rek', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для рекламы /form1'))
 bot.hears('/news', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для новостей /form2'))




const userStage = {};
const replyTarget = {};

bot.command('form1', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form1_text';
  ctx.reply('Введите название компании;\n\nРасскажите, что хотите рекламировать;\n\nИ напишите свой номер телефона.');
});

bot.command('form2', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form2_text';
  ctx.reply('Введите дату новости;\n\nИ содержание новости;');
});

bot.command('reply', async (ctx) => {
  const replyMsg = ctx.message.reply_to_message;
  if (!replyMsg) return ctx.reply('Ответьте на сообщение командой /reply');
  const userId = ctx.from.id;
  userStage[userId] = 'waiting_for_reply';
  replyTarget[userId] = ctx.chat.id;
  ctx.reply('Напишите текст ответа — он будет отправлен в группу.');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const stage = userStage[userId];
  const forwardTo = process.env.ID;

  // Обработка ответа на сообщение в группе (нативный ответ, без команды)
  if (ctx.message.reply_to_message) {
    const repliedMsg = ctx.message.reply_to_message;
    const replyText = ctx.message.text;
    const groupName = ctx.chat.title || 'Группа';
    const adminMsg = `Ответ на сообщение в группе "${groupName}" (ID сообщения: ${repliedMsg.message_id}):\n\n\${replyText}`;
    await bot.telegram.sendMessage(forwardTo, adminMsg);
    return; // Прерываем дальнейшую обработку, чтобы не конфликтовать с формами
  }

  if (stage === 'waiting_for_form1_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@\${ctx.from.username}` : 'нет username';
    const msg = `Новая рекламная заявка:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    await bot.telegram.sendMessage(forwardTo, msg);
    delete userStage[userId];
    ctx.reply('Заявка на рекламу отправлена!');
  } 
  else if (stage === 'waiting_for_form2_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@\${ctx.from.username}` : 'нет username';
    const msg = `Новость:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    await bot.telegram.sendMessage(forwardTo, msg);
    delete userStage[userId];
    ctx.reply('Новость отправлена!');
  }
  else if (stage === 'waiting_for_reply') {
    const text = ctx.message.text;
    const targetChat = replyTarget[userId];
    await bot.telegram.sendMessage(targetChat, `Ответ от администратора:\n\n\${text}`);
    delete userStage[userId];
    delete replyTarget[userId];
    ctx.reply('Ответ отправлен в группу.');
  }
});


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






