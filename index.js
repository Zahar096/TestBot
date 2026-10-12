
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
 await ctx.replyWithHTML('Форму заполнения нужно составить в одном сообщении /addnote',{
  
})
    } catch (e) {
      console.error(e)
    }
 })



const userStage = {}; 

bot.command('addnote', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_text';
  ctx.reply('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  if (userStage[userId] !== 'waiting_for_text') return; // игнорируем, если не ждём текст

  const text = ctx.message.text;
  const forwardTo = process.env.ID;

  // Отправляем «готовое» сообщение с вписанным текстом
  await bot.telegram.sendMessage(forwardTo, `Новая рекламная заявка:\n\n${text}`);

  delete userStage[userId]; // сбрасываем состояние
  ctx.reply('Замявка на рекламу отправлена!');
});








bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






