
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
  if (!replyMsg) {
    return ctx.reply('Ответьте на сообщение и напишите /reply');
  }
  const userId = ctx.from.id;
  userStage[userId] = 'waiting_for_reply';
  replyTarget[userId] = ctx.chat.id;
  ctx.reply('Напишите текст ответа — он будет отправлен в группу.');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const stage = userStage[userId];
  const forwardTo = process.env.ID;

  // ГЛАВНЫЙ БЛОК: нативный «Ответить» в группе -> пересылка админу
  if (ctx.message.reply_to_message && ctx.chat.type !== 'private') {
    const repliedMsg = ctx.message.reply_to_message;
    const replyText = ctx.message.text;
    const groupName = ctx.chat.title || 'Группа';
    const adminMsg = `🗣 Ответ в группе "${groupName}"\n\nID сообщения: ${repliedMsg.message_id}\n\nТекст ответа:\n\n${replyText}`;

    console.log(`[DEBUG] Получен ответ в группе. Пытаемся отправить админу (forwardTo=${forwardTo})...`);

    try {
      // ВАЖНО: forwardTo должен быть числом (например, 123456789), не строкой
      await bot.telegram.sendMessage(forwardTo, adminMsg);
      console.log('[DEBUG] Ответ успешно отправлен админу.');
    } catch (e) {
      console.error('[ERROR] Не удалось отправить ответ админу:', e.description || e);
      // Опционально: можно написать в группу, если бот админ
      // await ctx.reply(`⚠️ Не удалось переслать ответ администратору. Ошибка: ${e.description}`);
    }
    return; // Дальше не обрабатываем, чтобы не мешать формам
  }

  // Дальше: обработка форм и /reply (без изменений)
  if (stage === 'waiting_for_form1_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';
    const msg = `Новая рекламная заявка:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    try {
      await bot.telegram.sendMessage(forwardTo, msg);
      delete userStage[userId];
      ctx.reply('Заявка на рекламу отправлена!');
    } catch (e) {
      console.error('Ошибка отправки заявки:', e);
      ctx.reply('Произошла ошибка при отправке заявки. Попробуйте позже.');
    }
  } 
  else if (stage === 'waiting_for_form2_text') {
    const text = ctx.message.text;
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';
    const msg = `Новость:\n\n${text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`;
    try {
      await bot.telegram.sendMessage(forwardTo, msg);
      delete userStage[userId];
      ctx.reply('Новость отправлена!');
    } catch (e) {
      console.error('Ошибка отправки новости:', e);
      ctx.reply('Произошла ошибка при отправке новости. Попробуйте позже.');
    }
  }
  else if (stage === 'waiting_for_reply') {
    const text = ctx.message.text;
    const targetChat = replyTarget[userId];
    try {
      await bot.telegram.sendMessage(targetChat, `Ответ от администратора:\n\n${text}`);
      delete userStage[userId];
      delete replyTarget[userId];
      ctx.reply('Ответ отправлен в группу.');
    } catch (e) {
      console.error('Ошибка отправки ответа в группу:', e);
      ctx.reply('Не удалось отправить ответ в группу. Проверьте, что бот — админ в группе.');
    }
  }
});


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






