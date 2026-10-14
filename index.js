
const { Telegraf} = require('telegraf')
const { Markup } = require('telegraf/markup');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'}.\n\n Предложиту вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /course  \n РАЗМЕСТИТЬ НОВОСТЬ /coursu`))
bot.help((ctx) => ctx.reply(text.commands))

 bot.hears('/course', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для рекламы /addnote'))
 bot.hears('/coursu', (ctx) => ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения для новостей /addnote1'))











bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






