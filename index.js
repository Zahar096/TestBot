
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = '-1001506181298';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }. Предложить вашу новость или закажить у нас рекламу. Можно перейдя сюда /course `))
bot.help((ctx) => ctx.reply(text.commands))
bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))

bot.command('course', async (ctx) => {
    try{
   await ctx.replyWithHTML('<b> Перейдите в форму заполнения под вашу нужду </b>', Markup.inlineKeyboard(
[
    [Markup.button.callback('Предложить рекламу', 'btn_1'), Markup.button.callback('Предложить новость','btn_2')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})





 bot.action('btn_1', async (ctx) => {
    try {
 await ctx.replyWithHTML('Обработка кнопки 1',{
   
})
    } catch (e) {
      console.error(e)
    }
 })


 bot.on('message', (ctx) => {
    const chatId = ctx.chat.id;
    bot.telegram.sendMessage(-1001506181298, ctx.text);
 })



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






