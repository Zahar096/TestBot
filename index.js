
const { Telegraf} = require('telegraf')
const { inlineKeyboard } = require('telegraf/inlineKeyboard');
const { message } = require('telegraf/filters')
require('dotenv').config()
const text = require('./const')

const targetChatId = 'process.env.ID';

const bot = new Telegraf (process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец' }.\n\n Предложиту вашу новость или закажите у нас рекламу.\n\n ПРЕДЛОЖИТЬ РЕКЛАМУ /rek  \n РАЗМЕСТИТЬ НОВОСТЬ /coursu`))
bot.help((ctx) => ctx.reply(text.commands))

// bot.hears('hi', (ctx) => ctx.reply('Здравствуйте'))






bot.command ('rek ', async (ctx) => {
 const inlineKeyboard = new inlineKeyboard()
  .text ('Для рекламы', 'button_1');

await ctx.reply('Перейдите в форму заполнения',{
    reply_markup: inlineKeyboard
})
});

bot.callbackQuery('button_1', async (ctx) => {
  await ctx.reply('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения /addnote',{
  })
})






bot.command('coursu', async (ctx) => {
    try{
   await ctx.replyWithHTML('<b> Перейдите в форму заполнения </b>', inlineKeyboard(
[
    [inlineKeyboard.button.callback('Сообщить новость', 'btn_2')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})









 bot.action('btn_1', async (ctx) => 
     {
 await ctx.replyWithHTML('Форму заполнения нужно составить в одном сообщении. Перейти к форме заполнения /addnote',{
  })
 })







 




const userStage = {}; 

bot.command('addnote', (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_text';
  ctx.reply('Введите название компании; \n\n Раскажите что хотите рекламировать;\n\n И напишите свой номер телефона.');
});


  const tex = ctx.message.tex;
  const forwardTo = process.env.ID;

  // Отправляем «готовое» сообщение с вписанным текстом
  await bot.telegram.sendMessage(forwardTo, `Новая рекламная заявка:\n\n\ ${tex}\n\nОтправитель: ${ctx.from.first_name} ${ctx.from.last_name ? ctx.from.last_name : ''} (@${ctx.from.username ? ctx.from.username : 'нет username'}) \nID: ${ctx.from.id}`);


  delete userStage[userId]; // сбрасываем состояние
  ctx.reply('Заявка на рекламу отправлена!');













bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






