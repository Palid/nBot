var mongoose = require('mongoose'),
    Schema = mongoose.schema;

var channelSchema = new Schema({
    name: String,
    users: {
        name: String,
        aliases: [],
        memo: [],
        seen: Date
    },
    links: {
        link: String,
        firstBy: String,
        count: Number,
        lastDate: Date
    }
});