const { MessageEmbed } = require("discord.js");
const { ghostPingDelete } = require("../automod/ghostPing");
const guildConfig = require("../models/guildConfig");

module.exports = {
    name : "messageDelete",
    async run(client , message) {
        if(!client.guildConfig.get(message.guild.id)) {
            const result = await guildConfig.findOne({guildId : message.guild.id})
            if(!result){
                const newGuildConfig = new guildConfig({
                    guildId : message.guild.id
                })
                await newGuildConfig.save()
                    .then(() => console.log(`New Guild Config Created for ${message.guild.name}`))
                    .catch(err => console.log(err))

                await ghostPingDelete({client , message});
                return;
            }
        }
        await ghostPingDelete({client , message});
        if(!client.guildConfig.get(message.guild.id).logging) return;
        if(client.guildConfig.get(message.guild.id).modLog == undefined || client.guildConfig.get(message.guild.id).modLog == null) return;

        const guild = client.guilds.cache.get(message.guild.id);
        if(!guild) return;

        let modLog;
           try{
             modLog = await guild.channels.fetch(client.guildConfig.get(message.guild.id).modLog);
           }

           catch(e){
               //console.log(e)
               return;
           }

           modLog.send({content : `** Message sent by <@${message.author.id}>** was deleted  in ${message.channel}`,embeds : [new MessageEmbed().setColor("#ff0000").setDescription(`\nContent : **${message.content}**`)]});
    }
} 