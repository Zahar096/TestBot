
const { Telegraf} = require('telegraf')
const { Markup } = require('telegraf/markup');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'}.\n\n Предложиту вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /rek  \n РАЗМЕСТИТЬ НОВОСТЬ /news`))
bot.help((ctx) => ctx.reply(text.commands))

 bot.hears('/rek', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для рекламы /addnote'))
 bot.hears('/news', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для новостей /form2'))



const userStage = {}; 

bot.command('addnote', async (ctx) => {
   userStage[ctx.from.id] = 'waiting_for_text';
  await ctx.reply('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.');



  const text = ctx.message.text;
  const forwardTo = process.env.ID;

  // Отправляем «готовое» сообщение с вписанным текстом
  await bot.telegram.sendMessage(forwardTo, ` Новая рекламная заявка:\n\n${text}`);

  delete userStage[userId]; // сбрасываем состояние
 await ctx.reply('Заявка на рекламу отправлена!');
});







bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






