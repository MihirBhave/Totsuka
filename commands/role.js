const { Permissions, Constants, MessageEmbed, InviteGuild } = require("discord.js");

module.exports = {
    name : "role",
    description : "Adds/Removes a role to/from a user",
    slash : true,
    permissions : [Permissions.FLAGS.MANAGE_ROLES],
    options : [
        {
            name : "add",
            description : "Adds a role to the user",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "role",
                    description : "The role to add",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : true
                },
                {
                    name : "member",
                    description : "The member to add the role to",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                }
            ]
        },
        {
            name : "remove",
            description : "Removes a role from the user",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "role",
                    description : "The role to remove",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : true
                },
                {
                    name : "member",
                    description : "The member to remove the role from",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                }
            ]
        }
    ],
    async execute({interaction , options , message}){
        if(message) return;

        const role = await interaction.guild.roles.fetch(options.getRole("role").id);
        const member = await interaction.guild.members.fetch(options.getUser("member").id);
        if(!role || !member) return interaction.reply({content : "Invalid Role/Member" , ephemeral : true});
        if(role.name == "@everyone") return interaction.reply({content : "Everyone Role cannot be assigned." , ephemeral : true});

        const embedAdd = new MessageEmbed()
            .setTitle("Role Added")
            .setDescription(`**${member.user.username}** has been given the role <@${role.id}>`)
            .setColor("RANDOM")
            .setFooter({text : "Requested by " + interaction.user.tag, iconURL : interaction.user.avatarURL() || null});

         const embedRemove = new MessageEmbed()
            .setTitle("Role Removed")
            .setDescription(`<@${role.id}> role has been removed from **${member.user.username}**`)
            .setColor("RANDOM") 
            .setFooter({text : "Requested by " + interaction.user.tag, iconURL : interaction.user.avatarURL() || null});

        if(options.getSubcommand("add") === "add"){
            if((interaction.member.roles.highest.position > role.position && interaction.member.roles.highest.position > member.roles.highest.position) || interaction.guild.ownerId === interaction.member.id){
                member.roles.add(role)
                    .then(() => interaction.reply({ embeds : [embedAdd] }))
                    .catch(e => {
                        interaction.reply({content : "My highest role is placed below the destined role." , ephemeral : true})
                })
         }
         else{
            await  interaction.reply({content : " You are not authorised to perform this operation." , ephemeral : true})
         }
                
        } 
        else if(options.getSubcommand("remove") === "remove"){
            if((interaction.member.roles.highest.position > role.position && interaction.member.roles.highest.position > member.roles.highest.position) || interaction.guild.ownerId === interaction.member.id){
                member.roles.remove(role)
                    .then(() => interaction.reply({ embeds : [embedRemove] }))
                    .catch(e => {
                        interaction.reply({content : "My highest role is placed below the destined role." , ephemeral : true})
                })
            }
            else{
                await  interaction.reply({content : " You are not authorised to perform this operation." , ephemeral : true})
            }
        }
        
    }
}
