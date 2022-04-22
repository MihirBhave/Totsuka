const { Permissions , Constants} = require("discord.js");

module.exports = {
    name : "clear",
    description : "Clears messages from a channel",
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : "number",
            description : "The number of messages to delete",
            type : Constants.ApplicationCommandOptionTypes.INTEGER,
            required : true,
            minValue : 1,
            maxValue : 100
        },
        {
            name : "channel",
            description : "The channel to delete messages from",
            type : Constants.ApplicationCommandOptionTypes.CHANNEL,
        },
        {
            name : "pinned",
            description : "Whether to delete pinned messages",
            type : Constants.ApplicationCommandOptionTypes.BOOLEAN,
            defaultValue : false
        },
        {
            name : "user",
            description : "The user to delete messages from",
            type : Constants.ApplicationCommandOptionTypes.USER,
        }
    ],
    async execute({ interaction , options , message  }){
        if(message) return;

        let member;
        const messageInt = await interaction.deferReply({fetchReply : true})

        let number = options.getInteger('number');
        let channel = options.getChannel('channel') || interaction.channel;
        let pinned = options.getBoolean('pinned')
        member = options.getUser('user') ? await interaction.guild.members.fetch(options.getUser('user').id) : null;

        if(number < 100) number = number +1;
        if(pinned == null) pinned = false;
        channel = await interaction.guild.channels.fetch(channel.id)
        if(!channel) return interaction.editReply(`Failed to find channel **${channel.name}**`);

        let messages = await channel.messages.fetch({ limit : number });
    
        if(!pinned) messages = messages.filter(m => !m.pinned );
        if(member) messages = messages.filter(m => m.author.id === member.id);
        messages = messages.filter(m => m.id !== messageInt.id)
    
        if(messages.size === 0) return interaction.editReply(`Failed to find messages from channel **${channel.name}** with the current filters.`);

        try{
            await channel.bulkDelete(messages , true)
                .then((deletedMessages) => interaction.editReply(`Successfully deleted **${deletedMessages.size}** message(s) from channel **${channel.name}**`))
                .catch((error) => interaction.editReply(`Failed to delete messages from channel **${channel.name}**`));
        }
        catch(e){
            console.log('error', e)
        }

        

    }
}