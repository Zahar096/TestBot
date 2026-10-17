

const { Telegraf} = require('telegraf')
const { Markup } = require('telegraf/markup');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = process.env.ID;

const bot = new Telegraf (process.env.BOT_TOKEN)

const msgIdToUserId = {};

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
   if (ctx.message.reply_to_message) {
    const repliedMsg = ctx.message.reply_to_message;
    const originalAuthorId = msgIdToUserId[repliedMsg.message_id];

    if (originalAuthorId) {
      const replyText = ctx.message.text;
      const adminName = ctx.from.first_name || 'Администратор';
      const msg = `Ответ от ${adminName}:\n\n${replyText}`;

      try {
        await bot.telegram.sendMessage(originalAuthorId, msg);
        // Можно добавить подтверждение админу в группе
        await ctx.reply('✅ Ответ отправлен пользователю.');
      } catch (e) {
        console.error('Не удалось отправить ответ пользователю:', e.description);
        await ctx.reply(
          '⚠️ Не удалось отправить ответ: пользователь не запускал бота (не нажимал Start).'
        );
      }
      return;
    }
  }

  // 2. Обычное сообщение от пользователя — пересылаем в группу админов
  const userName = `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
  const username = ctx.from.username ? `@${ctx.from.username}` : 'нет username';
  const payload = [
    `📩 Новое сообщение от пользователя`,
    `ID: ${userId}`,
    `Имя: ${userName}`,
    `Username: ${username}`,
    `---`,
    ctx.message.text,
  ].join('\n');

  try {
    const sent = await bot.telegram.sendMessage(targetChatId, payload);
    // Сохраняем связь: сообщение в группе → пользователь
    msgIdToUserId[sent.message_id] = userId;
    await ctx.reply('Ваше сообщение отправлено админам. Ждите ответа.');
  } catch (e) {
    console.error('Ошибка отправки в группу админов:', e);
    await ctx.reply('Произошла ошибка при отправке сообщения. Попробуйте позже.');
  }
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


