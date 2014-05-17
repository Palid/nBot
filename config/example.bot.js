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
        urlScrapeTitle: "↳ title:",
        root: "palid",
        database: {
            type: "tingodb",
            // If the database is tingodb you can either specify absolute path
            // to the database, or leave it undefined to create a database dir
            // in bot's directory
            url: undefined
        },
        deleteMe: true
    }
};