const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name : "invitebot",
    description : "Invite the bot to your server.",
    slash : true,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    async execute({message , interaction , options}){
        if(message) return;

        const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Invite")
                            .setURL("https://discord.com/api/oauth2/authorize?client_id=960219265364021288&permissions=8&scope=bot%20applications.commands")
                            .setStyle("LINK")
                    )

        //Add invite link.
        const embed = new MessageEmbed()
                        .setTitle("Invite Totsuka")
                        .setColor("RANDOM")
                        .setDescription("If you have liked our bot , Please consider inviting it to your server using the button link given below.")
        
        await interaction.reply({embeds : [embed] , components : [row]})


        }

}