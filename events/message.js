const WarnModel = require('../models/warnModel')

module.exports = {
    name : "messageCreate",
    async run(client , message){
        //console.log(client)
        const features = client.guildConfig.get(message.guild.id)
        if(!features) return;

        const modRoles = features.modRoles;
            for(let i = 0; i < modRoles.length; i++){
                if(message.member.roles.cache.has(modRoles[i])) return;
            }

        const ignoredChannels = features.ignoredChannels;
            for(let i = 0; i < ignoredChannels.length; i++){
                if(message.channel.id === ignoredChannels[i]) return;
            }
    
        if(features.antiCurse){
            if(!message.content || message.author.bot) return;
            if(message.member.permissions.has("ADMINISTRATOR")) return;

            const bannedWords = features.bannedWords
        
            for(let i = 0 ; i < bannedWords.length ;i++){
                //console.log(bannedWords[i])
                if(message.content.toLowerCase().includes(bannedWords[i])){
                    const memberId = message.author.id
                    const member = message.member
                    const channel = message.channel
                    const guildId = message.guild.id
                    await message.delete()
                    channel.send({content : `Watch your tongue <@${message.author.id}>` , fetchReply : true})
                        .then((msg) => {setTimeout(() => {msg.delete()}, 5000)})
                    

                    const Warn = new WarnModel(
                        {
                            guildId : guildId,
                            memberId : memberId,
                            reason : `Used a banned word : ${bannedWords[i]}`
                        }
                    )
                    try{
                        await Warn.save()                           
                             await WarnModel.find({memberId : memberId , guildId : guildId})
                                        .then(async(warns) => {
                                            warnLength = warns.length
                                            //console.log(warns)
                                            if(warnLength === 1){
                                                channel.send({content : `<@${memberId}> has been warned for using a banned word.`})
                                            }
                                            else if(warnLength === 2){
                                                await member.timeout(1000* 60 *10 , `2 warns`)
                                                    .then(() => channel.send({content : `<@${memberId}> has been timed out for 10 minutes for 2 warns.`}))
                                                    .catch(e => console.log(e))
                                            }
                                            else if(warnLength === 3){
                                                await member.timeout(1000* 60 *30 , `3 warns`)
                                                    .then(() => channel.send({content : `<@${memberId}> has been timed out for 30 minutes for 3 warns.`}))
                                                    .catch(e => console.log(e))
                                            }
                                            else if(warnLength === 4){
                                                await member.kick(`4 warns`)
                                                    .then(() => channel.send({content : `<@${memberId}> has been kicked for 4 warns.`}))
                                                    .catch(e => console.log(e))
                                            }
                                            else if(warnLength >= 5){
                                                await member.ban({reason : `5 warns`})
                                                    .then(() => channel.send({content : `<@${memberId}> has been banned for 5 warns.`}))
                                                    .catch(e => console.log(e))
                                            }
                                        })
                                        .catch(e => console.log(e))

                                    }
                            catch(e){
                            return;
                            }

                            break;
                }
            }
        }
    }
}