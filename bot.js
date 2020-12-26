require('dotenv').config();
const { Telegraf } = require('telegraf');
const controller = require('./g-sheets');

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);

/** Middleware */
bot.use(async (ctx, next) => {
  ctx.reply('Please wait!');
  const startDate = new Date();
  await next();
  const ms = new Date() - startDate;
  console.log(`Response time: %sms`, ms);
});

/** Commands */
bot.command(['stock'], async (ctx) => {
  /** Get text */
  const product = ctx.message.text.includes('@IdamDevBot')
    ? ctx.message.text.substr(18)
    : ctx.message.text.substr(7);

  console.log('product: ', product);
  if (product) {
    try {
      const data = await controller.getStock(product);

      let message = '';
      if (typeof data === 'string') {
        message = data;
      } else {
        message =
          data !== null
            ? `Stock ${data.name}: ${data.stock}`
            : `Product ${product} notfound`;
      }
      ctx.reply(message);
    } catch (err) {
      console.error('---------- Error -------');
      console.error(err);
      console.error('------------------------');
      ctx.reply(err.message.toString());
    }
  } else {
    ctx.reply('Please insert product name after command!');
  }
});

bot.launch();

console.log('Bot server is started');
