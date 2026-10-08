
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }`))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






