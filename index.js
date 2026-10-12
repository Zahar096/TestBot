
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
    [Markup.button.callback('Разместить рекламу /addnote', 'btn_1'), Markup.button.callback('Сообщить новость','btn_2')]
]
    ))
    } catch (e) {
        console.error(e)
    }
})




const userStage = {};

bot.action('btn_1', async (ctx) => {
  try {
    userStage[ctx.from.id] = 'waiting_for_text';
    await ctx.reply(
      'Введите название компании, расскажите, что хотите рекламировать, и укажите номер телефона.'
    );
  } catch (e) {
    console.error(e);
  }
});

bot.command('addnote', async (ctx) => {
  userStage[ctx.from.id] = 'waiting_for_text';
  await ctx.reply(
    'Введите название компании, расскажите, что хотите рекламировать, и укажите номер телефона.'
  );
});



  const text = ctx.message.text;
  const forwardTo = process.env.ID;

  // Отправляем «готовое» сообщение с вписанным текстом
  await bot.telegram.sendMessage(forwardTo, ` Новая рекламная заявка:\n\n${text}`);

  delete userStage[userId]; // сбрасываем состояние
  ctx.reply('Рекламная заявка отправлена!');









bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))






