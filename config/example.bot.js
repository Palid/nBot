module.exports = {
    irc: {
        network: "localhost",
        port: 6667,
        showErrors: false,
        //* debug: false,
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
        //* sasl: true,
        //* login: "login",
        //* password: "password",
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
            url: "mongodb://localhost/nBot",
            //* login: "login",
            //* password: "password"
        },
        webserver: {
            url: 'http://example.com',
            port: 3000
        }
    }
};
