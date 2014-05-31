module.exports = {
    irc: {
        network: "chat.freenode.net",
        port: 6667,
        showErrors: false,
        autoRejoin: true,
        autoConnect: true,
        retryCount: null,
        retryDelay: 2000,
        nick: "exampleNick",
        userName: "aBot",
        realName: "That is my real name",
        channels: ["#nBot"],
        floodProtection: true,
        floodProtectionDelay: 100,
        messageSplit: 512,
        sasl: true,
        login: "login",
        password: "password",
        secure: false,
        selfSigned: false,
        certExpired: false,
        stripColors: true,
        channelPrefixes: "&#"
    },
    options: {
        commandCharacter: ",",
        defaultLang: "en",
        urlScrapeTitle: {
            begin: "↳",
            repost: '[post]'
        },
        root: "palid",
        database: {
            type: "mongodb",
            user: "chomis",
            password: "iLikeTrains",
            url: "mongodb://localhost/nBot"
        }
    }
};