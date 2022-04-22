const {Permissions, Constants, MessageEmbed} = require('discord.js');

module.exports = {
    name : "list",
    description : "Lists all the  ban/invites",
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : "options",
            description : "Invites/Bans",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true,
            choices : [
                {
                    name : "invites",
                    value : "invites"
                },
                {
                    name : "bans",
                    value : "bans"
                }
            ]
        }
    ] , 
    async execute({interaction , options , message}){
        if(message) return;

        const query = options.getString("options") 
        await interaction.deferReply()

        if(query === "bans"){
            let bansList = "";
         const bans = await interaction.guild.bans.fetch()
                        .catch(err => interaction.editReply({content : "I cannot fetch the bans list." , ephemeral : true}));

        
        bansList = bans.map(ban => `${ban.user.tag}(${ban.user.id}) - ${ban.reason}`).join("\n") || "No bans found.";
        
        if(bansList.length > 2000) bansList = bansList.substring(0, 2000);

        const embed = new MessageEmbed()
                        .setTitle('Guild Bans')
                        .setColor("RANDOM")
                        .setDescription(bansList)
                        .setFooter({text : `Requested by ${interaction.member.user.tag} ` , icon_url : interaction.user.avatarURL()})

        await interaction.editReply({embeds : [embed]})
        }
        else if(query === "invites"){
            let invitesList = "";
        const invites = await interaction.guild.invites.fetch()
                        .catch(err => interaction.editReply({content : "I cannot fetch the invites list." , ephemeral : true}));

        invitesList = invites.map(invite => `${invite.code} - ${invite.uses} uses \t By : ${invite.inviter.username}#${invite.inviter.discriminator}`).join("\n") || "No invites found.";

        if(invitesList.length > 2000) invitesList = invitesList.substring(0, 2000);
        const embed = new MessageEmbed()
                        .setTitle('Guild Invites')
                        .setColor("RANDOM")
                        .setDescription(invitesList)
                        .setFooter({text : `Requested by ${interaction.member.user.tag} ` , icon_url : interaction.user.avatarURL()})

        await interaction.editReply({embeds : [embed]})
                .then(() => console.log("DOne"))
                .catch((err) => console.log(err))
        }

    }
}