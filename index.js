
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`<b>Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }<b>. <br> Предложите нам вашу новость или закажите у нас рекламу `))
bot.help((ctx) => ctx.reply(text.commands))
bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






