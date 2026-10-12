
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }.\n\n Предложиту вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /course \n РАЗМЕСТИТЬ НОВОСТЬ /coursu`))
bot.help((ctx) => ctx.reply(text.commands))

// bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))



bot.command('course', async (ctx) => {
    try{
   await ctx.replyWithHTML('<b> Перейдите в форму заполнения </b>', Markup.inlineKeyboard(
[
    [Markup.button.callback('Для рекламы', 'btn_1')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})

bot.command('coursu', async (ctx) => {
    try{
   await ctx.replyWithHTML('<b> Перейдите в форму заполнения </b>', Markup.inlineKeyboard(
[
    [Markup.button.callback('Сообщить новость','btn_2')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})









 bot.action('btn_1', async (ctx) => {
    try {
 await ctx.replyWithHTML('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения /addnote',{
  
})
    } catch (e) {
      console.error(e)
    }
 })



const forwardTo = process.env.ID?.trim();

if (!forwardTo) {
  console.error('❌ Отсутствует ID в .env');
  return ctx.reply('Ошибка: администратор не настроил приём заявок.');
}

if (isNaN(forwardTo) && !forwardTo.startsWith('-')) {
  console.error('❌ Некорректный формат ID:', forwardTo);
  return ctx.reply('Ошибка: неверный формат ID чата.');
}

try {
  const sent = await bot.telegram.sendMessage(forwardTo, `Новая рекламная заявка:\n\n\${text}`);
  console.log('✅ Сообщение отправлено, message_id:', sent.message_id);
  delete userStage[userId];
  ctx.reply('Заявка на рекламу отправлена!');
} catch (error) {
  const desc = error.response?.error_description || error.message;
  console.error('❌ Ошибка API:', desc, '| chat_id:', forwardTo);
  ctx.reply(`Не удалось отправить заявку. Код ошибки: \${desc}`);
}








bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






