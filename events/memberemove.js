const { MessageEmbed } = require("discord.js");
const guildConfig = require("../models/guildConfig");

module.exports = {
    name : "guildMemberRemove",
    async run(client , member) { 
        if(client.user.id === member.id) return;
        if(!client.guildConfig.get(member.guild.id)) {
            const result = await guildConfig.findOne({guildId : member.guild.id})
            if(!result){
                const newGuildConfig = new guildConfig({
                    guildId : member.guild.id
                })
                await newGuildConfig.save()
                    .then(() => console.log(`New Guild Config Created for ${member.guild.name}`))
                    .catch(err => console.log(err))

                return;
            }
        }
        if(!client.guildConfig.get(member.guild.id).logging) return;
        if(client.guildConfig.get(member.guild.id).modLog == undefined || client.guildConfig.get(member.guild.id).modLog == null) return;

        const guild = client.guilds.cache.get(member.guild.id);
        if(!guild) return;

        let modLog;
           try{
             modLog = await guild.channels.fetch(client.guildConfig.get(member.guild.id).modLog);
           }

           catch(e){
               //console.log(e)
               return;
           }

           modLog.send({embeds : [new MessageEmbed().setColor("RANDOM").setTitle("Member Left").setDescription(`<@${member.id}> has left the server!`)]});
    }
}