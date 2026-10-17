

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

bot.command('form1', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form1_text';
  ctx.reply('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.\n\n Если после отправки сообщения не пришло уведомление "Заявка на рекламу отправлена!" Попробуйте заново. /form1 ');
});

bot.command('form2', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_form2_text';
  ctx.reply('Введите дату новости; \n\n И содержание новости;\n\n  Если после отправки сообщения не пришло уведомление "Новость отправлена!" Попробуйте заново. /form2');
});




bot.on('text', async (ctx) => {
  // Обработка ответа администратора в целевом чате
  if (String(ctx.chat.id) === String(targetChatId) &&
      ctx.message.reply_to_message) {
    const originalText = ctx.message.reply_to_message.text || '';
    const match = originalText.match(/\nID: (\d+)/);

    if (!match) {
      return ctx.reply('Не удалось определить пользователя для ответа.');
    }

    const userId = Number(match[1]);
    const replyText = ctx.message.text;

    await bot.telegram.sendMessage(
      userId,
      `Ответ от администрации:\n\n${replyText}`
    );

    return ctx.reply('Ответ отправлен пользователю.');
  }

  // Ниже — обработка сообщений пользователей по формам
  const userId = ctx.from.id;
  const stage = userStage[userId];

  if (stage === 'waiting_for_form1_text' ||
      stage === 'waiting_for_form2_text') {
    const name = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';

    const title = stage === 'waiting_for_form1_text'
      ? 'Новая рекламная заявка'
      : 'Новость';

    await bot.telegram.sendMessage(
      targetChatId,
      `${title}:\n\n${ctx.message.text}\n\nОтправитель: ${name} (${username})\nID: ${userId}`
    );

    delete userStage[userId];

    return ctx.reply(
      stage === 'waiting_for_form1_text'
        ? 'Заявка на рекламу отправлена! Ждите ответа от администраторов.'
        : 'Новость отправлена! Ждите ответа от администраторов.'
    );
  }
});


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


