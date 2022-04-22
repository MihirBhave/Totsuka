const { Permissions, Constants } = require("discord.js");

module.exports = {
    name : "nick",
    description : "Performs various nick related commands",
    slash : true,
    permissions : [Permissions.FLAGS.MODERATE_MEMBERS],
    options : [
        {
            name : "set",
            description : "Sets the nickname for the user",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "member",
                    description : "The member ",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                },
                {
                    name : "nickname",
                    description : "The nickname ",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        },
        {
            name : "remove",
            description : "Removes the nickname for the user (if any)",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "member",
                    description : "The member ",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                }
            ]
        },
        {
            name : "decancer",
            description : "Removes any special characters from the username",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "member",
                    description : "The member ",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                }
            ]
        }
    ],
    async execute({interaction , options , message}){
        if(message) return;

        await interaction.deferReply({ephemeral : true});
        const query = options.getSubcommand();

        if(query === "set"){
            const member = await interaction.guild.members.fetch(options.getUser("member").id)
            if(!member) return interaction.editReply("Could not find the member");

            let nickname = options.getString("nickname");
            if(nickname.length > 32) nickname = nickname.substring(0, 32);

            await member.setNickname(nickname , `Requested by ${interaction.user.tag}`)
                .then(() => interaction.editReply(`Set nickname for ${member.user.tag} to ${nickname}`))
                .catch(() => interaction.editReply(`I cannot set Nickname to <@${member.id}>`));
        }

        else if(query === "decancer"){

            const member = await interaction.guild.members.fetch(options.getUser("member").id)
            if(!member) return interaction.editReply("Could not find the member");

            let name = member.nickname || member.user.username;
            let nickname = name.replace(/[^a-zA-Z0-9_]/g, ' ');

            if(nickname === name) return interaction.editReply(`${member.nickname} has no special characters`);
            
            await member.setNickname(nickname , `Requested by ${interaction.user.tag}`)
                .then(() => interaction.editReply(`Set nickname for ${member.user.tag} to ${nickname}`))
                .catch(() => interaction.editReply(`I cannot set Nickname to <@${member.id}>`));

        }

        else if(query === "remove"){
            const member = await interaction.guild.members.fetch(options.getUser("member").id)
            if(!member) return interaction.editReply("Could not find the member");

            await member.setNickname(null , `Requested by ${interaction.user.tag}`)
                        .then(() => interaction.editReply(`Removed nickname for ${member.user.tag}`))
                        .catch(() => interaction.editReply(`I cannot remove Nickname for <@${member.id}>`));
        }
    }
}