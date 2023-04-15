const { Schema, model } = require("mongoose");

const welcomeMessageScheme = new Schema({
    guildID: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "#b734eb",
        required: true
    },
    title: {
        type: String,
        default: "Welcome to the [server]!",
        required: true
    },
    description: {
        type: String,
        default: "Make sure to read the rules! [user]",
        required: true
    },
    image: {
        type: String,
        default: "https://media.tenor.com/oqJo9GcbfjYAAAAi/welcome-images-server.gif",
        required: true
    },
});

module.exports = model("WelcomeMessage", welcomeMessageScheme, "WelcomeMessages");