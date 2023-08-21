const TelegramApi = require('node-telegram-bot-api');
const { gameOption, newStartOption } = require('./options');
const token = '6229446165:AAHgPKMyxJX4V65-9ITIz501C-X6RxWMwTs';



const bot = new TelegramApi(token,{polling:true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId,`Сейчас я загадаю число от 1 до 9 , а ты попробуй отгадать!)`);  
    const randomNum = Math.floor(Math.random() * 10);
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId,'Отгадывай!',gameOption);    
}

function start(){
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command:'/info',description:'Получить информацию о пользователе'},
        {command:'/game',description:'Сыграть в игру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start'){
            return await bot.sendMessage(chatId,`Добро пожаловать в моего первого бота!`);
        }
    
        if(text === '/info'){
            return await bot.sendMessage(chatId,`Тебя зовут: ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''} \nТвой id: ${msg.from.id}\nТвоё пользовательское имя: ${msg.from.username}` )
        }
        if(text === '/game'){
           return startGame(chatId);
        }
        return await bot.sendMessage(chatId,`Я тебя не понимаю, попробуй ещё раз!)`);
    })


    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
             return startGame(chatId);
        }

        if(chats[chatId] == data){
            return await bot.sendMessage(chatId,'Молодец!Отгадал',newStartOption);       
        }
        await bot.sendMessage(chatId,`Не отгадал, ничего в следующий раз повезёт! Я загадал число ${chats[chatId]}`);

    })
}

start();