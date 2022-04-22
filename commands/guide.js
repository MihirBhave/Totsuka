const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");
module.exports = {
    name : "guide",
    description : "A basic guide on how to use the commands.",
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    async execute({message , interaction , options}){
        if(message) return;

        const defaultEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Totsuka Guide")
            .setDescription("Thank You for adding our bot ! This guide will give you a basic walk through on how to use this bot ! Firstly this is a slash-command only bot with tons of different moderation commands.")

        let text = ""
        fs.readdirSync("./commands").forEach(file => {
            const value = require(`../commands/${file}`);
            text = text + `**${value.name}** : ${value.description}\n\n`
        })

        //console.log(text)

        const commandsEmbed = new MessageEmbed()
                                .setColor("#0099ff")
                                .setTitle("Commands of Totsuka Bot")
                                .setDescription(`Here are the commands : \n\n\n${text}`)

        const autoModEmbed = new MessageEmbed()
                                .setColor("#0099ff")
                                .setTitle("Auto Moderation Commands")
                                .setDescription("Automod is the best feature a Moderation bot can have !! For the automod to work as intended please provide the bot with a high role. The Automod system works like this : \n1st Warn : No further action.\n2nd Warn : Timeout for 10 minutes.\n3rd Warn : Timeout for 30 minutes.\n4th Warn : Kick.\n5th Warn : Ban.\n\n\n**Note :** The bot will not kick/ban/timeout users who have the same or higher  role as the bot and the setting will take about 30 seconds to get updated globally.")
                                .addFields({name : "enable", value : "You can enable the three features - Event Logger , Ghost Ping detector and anti Curse system. "},
                                {
                                    name : "disable",
                                    value : "You can disable the automod features using this command."
                                },
                                {
                                    name : "settings",
                                    value : "You can change the settings of the automod using this command."
                                },
                                {
                                    name : "ignoreChannels",
                                    value : "You can tell the bot which channels to ignore. The Automod will not run in these channels."
                                },
                                {
                                    name : "moderator_roles",
                                    value : "You can specify the moderator roles of the server. Automod will not take action against users with these roles."
                                },
                                {
                                    name : "banned_words",
                                    value : "You can specify the banned words of the server. Automod will not take action against users who type these words."
                                },
                                {
                                    name : "modlog",
                                    value : "You can specify the modlog channel of the server. Automod will log the  events in this channel."
                                }
                                )

                const helpEmbed = new MessageEmbed()
                                .setColor("#0099ff")
                                .setTitle("Support")
                                .setDescription("If you require some assistance or want to report a bug please join our support server using the button below!")


                const defaultRow = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("next1")
                                            .setLabel("Next")
                                            .setStyle("SUCCESS")

                                        )
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("exit")
                                            .setLabel("Exit")
                                            .setStyle("DANGER")
                                    )

                const autoModButton = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId("next2")
                                                    .setLabel("Next")
                                                    .setStyle("SUCCESS")
                                            )
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId("exit")
                                                    .setLabel("Exit")
                                                    .setStyle("DANGER")
                                            )

                const next3 = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("next3")
                                            .setLabel("Next")
                                            .setStyle("SUCCESS")
                                    )
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("exit")
                                            .setLabel("Exit")
                                            .setStyle("DANGER")
                                    )

                const helpModButton = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setLabel("Support")
                                                    .setStyle("LINK")
                                                    .setURL("https://discord.gg/536Ex6WCMG")
                                            )

                
                const msg = await interaction.reply({embeds : [defaultEmbed] , components : [defaultRow] , fetchReply: true})
                const filter = i => i.user.id === interaction.user.id;
                const collector = await msg.createMessageComponentCollector(filter, { time : 60000 });
                
                try{
                    collector.on("collect" , async (i) => {
                        if(!msg) return;
                        await i.deferUpdate({ fetchReply: true }) 
                                .catch(() => null)
                        switch(i.customId){
                            case "next1" :
                            msg.edit({embeds : [commandsEmbed] , components : [autoModButton]})
                            .catch(() => null)
                                collector.resetTimer();
                                break;
    
                            case "next2" :
                             msg.edit({embeds : [autoModEmbed] , components : [next3]})
                             .catch(() => null)
                                collector.resetTimer();
                                break;
                            
                            case "next3" :
                             msg.edit({embeds : [helpEmbed] , components : [helpModButton]})
                                .catch(() => null)
                                collector.resetTimer();
                                break;
    
                            case "exit" :
                                collector.stop();
                                break;
                        }
                    })
                }
                catch(e){
                    console.log(e)
                }
            

                collector.on("end" , async(collected) => {
                    await msg.edit({content : "Interaction Ended." , embeds : [] , components : []})
                        .catch(() => null)
                })


    }
}  