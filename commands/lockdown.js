const { Permissions, MessageActionRow, MessageButton } = require("discord.js")
const Discord = require('discord.js');
const { collection } = require("../models/inviteModel");

module.exports = {
    name : 'lockdown',
    description : 'Enforces a complete lockdown on the server.',
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : 'toggle',
            description : 'true/false',
            required : true,
            type : Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
        },
        {
            name : 'role',
            description : 'Role ',
            type : Discord.Constants.ApplicationCommandOptionTypes.ROLE
        }
    ],
    async execute({message , interaction , options}){
        if(message) return;

        console.log('running')
        //Buttons
        const yesRow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('all')
                                    .setLabel('All')
                                    .setStyle('PRIMARY')

                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('text')
                                    .setLabel('Text Channels')
                                    .setStyle('PRIMARY')
                                    
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('voice')
                                    .setLabel('Voice Channels')
                                    .setStyle('PRIMARY')
                                    
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('cancel')
                                    .setLabel('Cancel')
                                    .setEmoji('❌')
                                    .setStyle('DANGER')
                                    
                            )

       
        
        await interaction.deferReply()

        var role = options.getRole('role')
        const toggle = options.getBoolean('toggle')
        if(!role) role = interaction.guild.roles.everyone 

        if(toggle == true){
            interaction.editReply({content : 'What type of channels would you like to put under lockdown?' , components : [yesRow]})
            
        }
        else if(toggle == false){
            interaction.editReply({content : 'What type of channels would you like to free from lockdown?' , components : [yesRow]})
        }


        var channels = await interaction.guild.channels.cache.filter(chx => chx.type != 'GUILD_CATEGORY')
        console.log(channels.map(ch => ch.name).join("\n"))
        //channels = channels.filter(channel => channel.permissionsFor(role.id).has(Permissions.FLAGS.VIEW_CHANNEL))
        
        //Button Event Listener

        const filter = i =>  i.member.id === interaction.member.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000  }); 

        collector.on('collect' , async(btnInt) => {
            //All Button

            if(btnInt.customId == 'all'){

                if(toggle == true){
                    channels.forEach(async(channel) => {
                
                        if(channel.type == 'GUILD_TEXT'){
                            await channel.permissionOverwrites.edit(role.id , {
                                SEND_MESSAGES: false,
                                ATTACH_FILES: false,
                                ADD_REACTIONS: false
                            })
                            .then(() => console.log(`${channel.name} was locked.`))
                            .catch((err) => console.log(err))
                        }
        
                        else if(channel.type == 'GUILD_VOICE'){
                            await channel.permissionOverwrites.edit(role.id , {
                                CONNECT: false,
                                SPEAK: false,
                            })
                            .then(() => console.log(channel.name))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : `The server is put under lockdown for the role : **${role.name}**` , components : [] , ephemeral: true})
                }
                else if(toggle == false){
                    channels.forEach(async(channel) => {

                        if(channel.type == 'GUILD_TEXT'){
                            await channel.permissionOverwrites.edit(role.id , {
                                SEND_MESSAGES: true,
                                READ_MESSAGE_HISTORY: true,
                                ATTACH_FILES: true,
                                ADD_REACTIONS: true
                            })
                            .then(() => console.log(`${channel.name} was unlocked.`))
                            .catch((err) => console.log(err))
                        }
                        else if(channel.type == 'GUILD_VOICE'){
                            await channel.permissionOverwrites.edit(role.id , {
                                CONNECT: true,
                                SPEAK: true,
                            })
                            .then(() => console.log(`${channel.name} was unlocked.`))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : 'All the channels have been released from lockdown' , components : [] , ephemeral: true})
                }
            }

            //Text Button

            else if(btnInt.customId == 'text'){
                if(toggle == true){
                    channels.forEach(async(channel) => {
                
                        if(channel.type == 'GUILD_TEXT'){
                            await channel.permissionOverwrites.edit(role.id , {
                                SEND_MESSAGES: false,
                                READ_MESSAGE_HISTORY: false,
                                ATTACH_FILES: false,
                                ADD_REACTIONS: false
                            })
                            .then(() => console.log(`${channel.name} was locked.`))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : 'All the text channels have been put under lockdown.' , components : [] , ephemeral: true})
                }
                else if(toggle == false){
                    channels.forEach(async(channel) => {

                        if(channel.type == 'GUILD_TEXT'){
                            await channel.permissionOverwrites.edit(role.id , {
                                SEND_MESSAGES: true,
                                READ_MESSAGE_HISTORY: true,
                                ATTACH_FILES: true,
                                ADD_REACTIONS: true
                            })
                            .then(() => console.log(`${channel.name} was unlocked.`))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : 'All the text channels have been released from lockdown' , components : [] , ephemeral: true})
                }
            }

            //Voice Button
            if(btnInt.customId == 'voice'){
                if(toggle == true){
                    channels.forEach(async(channel) => {

                        if(channel.type == 'GUILD_VOICE'){
                            await channel.permissionOverwrites.edit(role.id , {
                                CONNECT: false,
                                SPEAK: false,
                            })
                            .then(() => console.log(`${channel.name} was locked.`))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : 'All the voice channels have been put under lockdown.' , components : [] , ephemeral: true})
                }
                else if(toggle == false){
                    channels.forEach(async(channel) => {

                        if(channel.type == 'GUILD_VOICE'){
                            await channel.permissionOverwrites.edit(role.id , {
                                CONNECT: true,
                                SPEAK: true,
                            })
                            .then(() => console.log(`${channel.name} was unlocked.`))
                            .catch((err) => console.log(err))
                        }
                   })

                   await btnInt.reply({content : 'All the voice channels have been released from lockdown' , components : [] , ephemeral: true})
                }
            }

            //Cancel Button
            if(btnInt.customId == 'cancel'){
               await btnInt.update({content : 'Alright , the action is cancelled.' , components : []})
               collector.stop()
            }
        })

        collector.on('end' , (collections) =>{
            //console.log(collections)
            if(collections.size=== 0) return  interaction.editReply({content : "Interaction Ended" , components : []})
        })
        // End of Button Handler.
        
}
}