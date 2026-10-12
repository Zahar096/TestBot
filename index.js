
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }.\n\n Предложить вашу новость или закажить у нас рекламу. Можно перейдя сюда /course `))
bot.help((ctx) => ctx.reply(text.commands))

// bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))



bot.command('course', async (ctx) => {
    try{
   await ctx.replyWithHTML('<b> Перейдите в форму заполнения под вашу нужду </b>', Markup.inlineKeyboard(
[
    [Markup.button.callback('Разместить рекламу', 'btn_1'), Markup.button.callback('Сообщить новость','btn_2')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})






 bot.action('btn_1', async (ctx) => {
    try {
 await ctx.replyWithHTML('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.',{
   
})
    } catch (e) {
      console.error(e)
    }
 })





bot.command('report', (ctx) => {
  userStage[ctx.from.id] = 'waiting_order_id';
  ctx.reply('Укажите ID заказа (только цифры), чтобы сформировать отчёт:');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  if (userStage[userId] === 'waiting_order_id') {
    const orderId = ctx.message.text.trim();
    const forwardTo = process.env.ID;

  
    const reportText = `Отчёт по заказу:\nID: ${orderId}\nСтатус: в обработке\nПриоритет: высокий`;

    await bot.telegram.sendMessage(forwardTo, reportText);

    delete userStage[userId];
    ctx.reply('Отчёт сформирован и отправлен.');
  }
});



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






