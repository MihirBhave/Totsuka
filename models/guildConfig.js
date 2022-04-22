const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId : {
        type : String,
        required : true,
    },
    logging : {
        type : Boolean,
        default : false,
    },
    ping : {
        type : Boolean,
        default : false,
    },
    antiCurse : {
        type : Boolean,
        default : false,
    },
    ignoredChannels : {
        type : Array,
        default : [],
    },
    modRoles : {
        type : Array,
        default : [],
    },
    bannedWords : {
        type : Array,
        default : [],
    },
    modLog : {
        type : String,
        default : null,
    }
})

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
