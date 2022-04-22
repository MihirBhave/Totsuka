const { Permissions, Constants, MessageEmbed } = require("discord.js");
const  GuildConfig = require('../models/guildConfig.js');

module.exports = {
    name : "automod",
    description : "Contains the automod features offered by the bot.",
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : "enable",
            description : "Enables the various automod features.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "feature",
                    description : "The feature to enable.",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true,
                    choices : [
                    {
                        name : "event_logger",
                        value : "event_enable",
                    },
                    {
                        name : "anti_curse",
                        value : "curse_enable",
                    },
                    {
                        name : "ghost_ping",
                        value : "ghost_enable",
                    },
                ]
                }
            ]
        },
        {
            name : "disable",
            description : "Disables the various automod features.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "feature",
                    description : "The feature to enable.",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true,
                    choices : [
                    {
                        name : "event_logger",
                        value : "event_disable",
                    },
                    {
                        name : "anti_curse",
                        value : "curse_disable",
                    },
                    {
                        name : "ghost_ping",
                        value : "ghost_disable",
                    }
                ]
                }
            ]
        },
        {
            name : "ignorechannels",
            description : "Does not moderate the channels specified.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND
        },
        {
            name : "moderator_roles",
            description : "People with these roles are not affected by automod.",
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
        },
        {
            name : "banned_words",
            description : "If any member types these words , automatic action will be taken.",
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
        },
        {
            name : "settings",
            description : "Displays the current automod settings.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND
        },
        {
            name : "modlog",
            description : "Sets the channel to log various events.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The channel to log events to",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                }
            ]
        }
    ],
    async execute({interaction , options , message , client}){
            if(message) return;
            if(!client.guildConfig.get(interaction.guild.id)){
                const obj = await GuildConfig.findOne({guildId : interaction.guild.id})
                if(!obj){
                const newConfig =  new GuildConfig({
                    guildId : interaction.guild.id
                })

                await newConfig.save()
                        .then(() => console.log("Created Data"))
                        .catch((err)  => console.log(err))
            }
            }

            await interaction.deferReply();

            const query = options.getSubcommand();

            switch(query){
                case "enable": 
                        if(options.getString("feature") === "event_enable"){
                         await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id}, {logging : true})
                                    .then((obj) => interaction.editReply({content : "Enabled event logger."}))
                                    .catch(() => interaction.editReply("There was some problem please try again later."));
                    }

                    else if(options.getString("feature") === "curse_enable"){
                       await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{antiCurse : true})
                                    .then((obj) => interaction.editReply({content : "Enabled anti-curse system"}))
                                    .catch(() => interaction.editReply("There was some problem please try again later."));
                    }

                    else if(options.getString("feature") === "ghost_enable"){
                        await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ ping : true})
                                    .then((obj) => interaction.editReply({content : "Enabled ghost ping system"}))
                                    .catch(() => interaction.editReply("There was some problem please try again later."));
                    }
                    break;

                case "disable":
                    
                    if(options.getString("feature") === "event_disable"){
                          await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{logging : false})
                                     .then((obj) => interaction.editReply({content : "Disabled event logger."}))
                                     .catch(() => interaction.editReply("There was some problem please try again later."));
                     }
 
                     else if(options.getString("feature") === "curse_disable"){
                        await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{antiCurse : false})
                                     .then((obj) => interaction.editReply({content : "Disabled anti-curse system"}))
                                     .catch(() => interaction.editReply("There was some problem please try again later."));
                     }
 
                     else if(options.getString("feature") === "ghost_disable"){
                         await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ping : false})
                                     .then((obj) => interaction.editReply({content : "Disabled ghost ping system"}))
                                     .catch(() => interaction.editReply("There was some problem please try again later."));
                     }
                     break;

                case "ignorechannels":
                    await interaction.editReply({content : "Please type the channels below which you want the bot to ignore from mod actions .(Max 5)"})

                    const filter = m => m.author.id === interaction.user.id;

                    const collector = interaction.channel.createMessageCollector({filter , max :1 , time : 30000 })

                    collector.on('collect' , async(item) => {
                       
                        if(item.mentions.channels.size === 0) return interaction.editReply({content : "Please mention a valid channel."})
                        let channels = item.mentions.channels.map(c => c.id)
                
                        if(channels.length > 5) channels = channels.slice(0,4)

                        await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ ignoredChannels : channels})
                                .then(() => interaction.editReply({content : "Ignored channels updated."}))
                                .catch(() => interaction.editReply("There was some problem please try again later."));
                        try{
                                    await item.delete()
                                }
                                catch(err){
                                    console.log(err)
                                }
                            }) 

                    collector.on('end' , (collected ) => {
                        if(collected.size === 0) return interaction.editReply({content : "You didn't reply on time."})
                    })

                    break;

                case "moderator_roles":
                    await interaction.editReply({content : "Please specify the Moderator Roles. The people with those roles can bypass the automod ( Max 5)."})

                    const filter2 = m => m.author.id === interaction.user.id;

                    const collector2 = interaction.channel.createMessageCollector({filter2 , max :1 , time : 30000 })

                    collector2.on('collect' , async(item) => {
                        if(item.mentions.roles.size ===0) return interaction.editReply({content : "Please mention a valid role."})
                        let roles = item.mentions.roles.map(r => r.id)

                        if(roles.length > 5) roles = roles.slice(0,4)

                        await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ modRoles : roles})
                                .then(() => interaction.editReply({content : "Moderator roles updated."}))
                                .catch(() => interaction.editReply("There was some problem please try again later."));

                                try{
                                    await item.delete()
                                }
                                catch(err){
                                    console.log(err)
                                }
                    })

                    collector2.on('end' , (collected ) => {
                        if(collected.size === 0) return interaction.editReply({content : "You didn't reply on time."})
                    })
                    break;
                
                case "banned_words":
                    await interaction.editReply({content : "Please specify the banned words seperated with a comma. The bot will automatically take action if any member types any of these words ( Max 20)."})

                    const filter3 = m => m.author.id === interaction.user.id;

                    const collector3 = interaction.channel.createMessageCollector({filter3 , max :1 , time : 30000 })

                    collector3.on('collect' , async(item) =>{
                     let words = item.content.split(",")
                     words = words.map(w => w.trim())
                     words = words.map(word => word.length > 20 ? word.slice(0,20) : word)
                     const saveWords = []
                     words.forEach(word => {
                         saveWords.push(word.length > 15 ? word.slice(0,15) : word)
                     })

                    // console.log(saveWords)
                    
                    await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ bannedWords : saveWords})
                                .then(() => interaction.editReply({content : "Banned words updated."}))
                                .catch(() => interaction.editReply("There was some problem please try again later."));
                     try{
                         await item.delete()
                     }
                     catch(err){
                         console.log(err)
                     }
                    })

                    collector3.on('end' , (collected) => {
                        if(collected.size === 0) return interaction.editReply({content : "You didn't reply on time."})
                    })
                    break;
                case "settings":
                    const config = client.guildConfig.get(interaction.guild.id)
                    //console.log(config)
                    if(!config) return interaction.editReply({content : "Please allow upto 30 seconds to register the Server Automod configuration."})
                    const channels = config.ignoredChannels.map(c => `<#${c}>`).join(", ")
                    const roles = config.modRoles.map(r => `<@&${r}>`).join(", ")
                    const embed = new MessageEmbed()
                                    .setTitle(`${interaction.guild.name} Automod Settings`)
                                    .setColor("#00ff00")
                                    .setDescription("Here are the Automod Settings ! Please note that settings take about a minute to get updated.")
                                    .addFields(
                                        {
                                            name : "Event Logger",
                                            value : `${config.logging ? "Enabled" : "Disabled"}`,
                                           
                                        },
                                        {
                                            name : "Anti-Curse System",
                                            value : `${config.antiCurse ? "Enabled" : "Disabled"}`,
                                          
                                        },
                                        {
                                            name : "Ghost Ping System",
                                            value : `${config.ping ? "Enabled" : "Disabled"}`,
                                        },
                                        {
                                            name : "Ignored Channels",
                                            value : `${config.ignoredChannels.length===0 ? "None" : channels}`,
                                        },
                                        {
                                            name : "Moderator Roles",
                                            value : `${config.modRoles.length===0  ? "None" : roles}`,
                                        },
                                        {
                                            name : "Banned Words",
                                            value : `${config.bannedWords.length===0 ? "None" : config.bannedWords.join(", ")}`,
                                        }
                                    )
                                    .setFooter({text : `Requested by ${interaction.user.tag}` , icon_url : interaction.user.avatarURL()})

                                    await interaction.editReply({embeds : [embed]})

                    break;

                    case "modlog":
                        await GuildConfig.findOneAndUpdate({guildId : interaction.guild.id},{ modLog : options.getChannel('channel').id})
                                        .then(() => interaction.editReply({content : "Modlog channel updated."}))
                                        .catch(() => interaction.editReply("There was some problem please try again later."));

                        break;


            }
    }
}