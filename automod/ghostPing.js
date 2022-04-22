const { MessageEmbed } = require("discord.js");

const ghostPingEdit = async({client , messageNew , messageOld}) => {

    const settings = client.guildConfig.get(messageNew.guild.id);
    //console.log(messageOld.mentions.members)
    if(!settings) return; 
    if(!settings.ping) return;
    if(messageNew.author.bot) return;
    //console.log(messageOld.mentions.members.size)
    if(messageOld.mentions.members.size ===0) return;

   // console.log("Ran till here.")
    const newMentions = messageNew.mentions.members.size >0 ? messageNew.mentions.members.map(m => `<@${m.id}>`).join(" , ") : "No Mention Found";
    const oldMentions = messageOld.mentions.members.size >0? messageOld.mentions.members.map(m => `<@${m.id}>`).join(" , ") : "No Mention Found";

    //console.log(oldMentions  , newMentions)
    const guild = client.guilds.cache.get(messageNew.guild.id);
    if(!guild) return;

    //console.log(oldMentions , newMentions)
    let modLog;
    try{
      modLog = await guild.channels.fetch(client.guildConfig.get(messageNew.guild.id).modLog);
    }
    catch(e){
        //console.log(e)
        return;
    }

    if(newMentions !== oldMentions){
        const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("Ghost Ping")
                        .setDescription("Possible Ghost Ping Detected !")
                        .addFields({name : "Old Mentions " , value : oldMentions },{name : "New Mentions" , value : newMentions } , {
                            name : "Author" , value : `<@${messageNew.member.id}>`
                        },
                        {name : "Channel" , value : `<#${messageNew.channel.id}>` })
                        

        await modLog.send({embeds : [embed]});
    }

}

const ghostPingDelete = async({client , message}) => {
    const settings = client.guildConfig.get(message.guild.id);
    //console.log(messageOld.mentions.members)
    if(!settings) return; 
    if(!settings.ping) return;
    if(message.author.bot) return;
    //console.log(message.mentions.members.size)
    if(message.mentions.members.size===0) return;

    const mentions = message.mentions.members.size > 0 ? message.mentions.members.map(m => `<@${m.id}>`).join(" , ") : "No Mention Found";
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
    if(!modLog) return;

    //console.log(mentions , message.channel.id , message.author.tag)

    const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Ghost Ping")
                    .setDescription("Possible Ghost Ping Detected !")
                    .addFields(
                        {name : "Mentions" , value : mentions },
                        {name : "Channel" , value : `<#${message.channel.id}>` },
                        {name : "Author" , value : `<@${message.author.id}>` }
                    )

    await modLog.send({embeds : [embed]})
}


module.exports.ghostPingDelete = ghostPingDelete;
module.exports.ghostPingEdit = ghostPingEdit;