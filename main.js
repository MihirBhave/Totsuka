const Discord = require('discord.js')
const sdhandler = require("sdhandler")
const mongoose = require('mongoose')
require('dotenv').config()

//Database Connection 
mongoose.connect(process.env.URI)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open' , () => console.log('Connected to database'))

const client = new Discord.Client({
    intents : [Discord.Intents.FLAGS.GUILDS , Discord.Intents.FLAGS.GUILD_MESSAGES , Discord.Intents.FLAGS.GUILD_MEMBERS , Discord.Intents.FLAGS.GUILD_PRESENCES , Discord.Intents.FLAGS.GUILD_INVITES ]
})

client.guildConfig = new Discord.Collection();
client.botDevOnly = new Discord.Collection();

client.botDevOnly.set("ownerOnly" , {
    channelId : "962346605774778428",
    guildId : "951847375016689765"
})

sdhandler.sdhandler({
    client : client,
    eventsDir : "./events",
    token : process.env["TOKEN"],
})
