const { MessageEmbed } = require("discord.js");
const ghostPing = require("../automod/ghostPing");
const guildConfig = require("../models/guildConfig");

module.exports = {
    name : "messageUpdate",
    async run(client, messageOld , messageNew) {
        if(messageNew.author.bot) return;
        if(!client.guildConfig.get(messageNew.guild.id)){
            const result = await guildConfig.findOne({guildId : messageNew.guild.id})
            if(!result){
                const newGuildConfig = new guildConfig({
                    guildId : messageNew.guild.id
                })
                await newGuildConfig.save()
                    .then(() => console.log(`New Guild Config Created for ${messageNew.guild.name}`))
                    .catch(err => console.log(err))

                await ghostPing.ghostPingEdit({client , messageNew , messageOld})
                

                return;
            }
        }
        try{
            await ghostPing.ghostPingEdit({client , messageNew , messageOld})
            //console.log("the program has been executed")
        }
        catch(e){
            console.log(e)
        }

        if(messageNew.content !== messageOld.content){
            if(!client.guildConfig.get(messageNew.guild.id).logging) return;
            if(client.guildConfig.get(messageNew.guild.id).modLog == undefined || client.guildConfig.get(messageNew.guild.id).modLog == null) return;
           const guild = client.guilds.cache.get(messageNew.guild.id);
           if(!guild) return;

           let modLog;
           try{
             modLog = await guild.channels.fetch(client.guildConfig.get(messageNew.guild.id).modLog);
           }

           catch(e){
               //console.log(e)
               return;
           }

           modLog.send({content : `**<@${messageNew.author.id}>** edited their message in ${messageNew.channel}`,embeds : [new MessageEmbed().setColor("#ff0000").setDescription(`**Old Message**\n${messageOld.content}\n\n**New Message**\n${messageNew.content}`)]});
        }
    }

}