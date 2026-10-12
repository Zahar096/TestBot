
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }.\n\n Предложить вашу новость или закажить у нас рекламу. Можно перейдя сюда /course `))
bot.help((ctx) => ctx.reply(text.commands))
bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))





bot.command('forward', (ctx) => {
  forwardingUsers.add(ctx.from.id);
  ctx.reply('Режим пересылки включён. Напиши /stop, чтобы выключить.');
});



 bot.action('btn_1', async (ctx) => {
    try {
 await ctx.replyWithHTML('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.',{
   
})
    } catch (e) {
      console.error(e)
    }
 })


bot.on('message',  (ctx) =>  {
    const chatId = ctx.chat.id;
    bot.telegram.sendMessage(process.env.ID, ctx.text);
 })



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






