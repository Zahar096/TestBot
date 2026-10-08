
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => console.log(ctx.message))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.hears('hi', (ctx) => ctx.reply('Здраствуйте'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






