var data = {
    "seen": {
        "aliases": [],
        "description": {
            "pl": ",seen [nick] - Bot podaje datę ostatniej wiadomości [nick].",
            "en": ",seen [nick] - Bot says [nick]'s last message date."
        }
    },
    "invite": {
        "aliases": [
            "inv"
        ],
        "description": {
            "pl": ",invite [użytkownik] [kanał] - Zaprasza [użytkownika] na [kanał].",
            "en": ",invite [user] [channel] - Invites [user] on [channel]."
        }
    },
    "kick": {
        "aliases": [
            "k"
        ],
        "description": {
            "pl": ",kick [użytkownik] [powód] - Wykopuje [użytkownika] z kanału z [powodem].",
            "en": ",kick [user] [reason] - Kicks [user] with [reason]"
        }
    },
    "topic": {
        "aliases": [
            "t"
        ],
        "description": {
            "pl": ",topic [string] - Zmienia temat kanału na [string].",
            "en": ",topic [string] - Changes channel topic to [string]."
        }
    },
    "alias": {
        "aliases": [
            "aliases"
        ],
        "description": {
            "pl": ",alias [cmd]- Wyświetla listę aliasów dla komendy.",
            "en": ",alias [cmd]- Lists all aliases for command."
        }
    },
    "bible": {
        "aliases": [
            "godsays",
            "bug",
            "biblia"
        ],
        "description": {
            "pl": ",bible [data] - Pokazuje [data] z biblii. Używa https://labs.bible.org/api_web_service",
            "en": ",bible [data] - Shows [data] from bible. Uses https://labs.bible.org/api_web_service"
        }
    },
    "catapi": {
        "aliases": [
            "cat",
            "cats",
            "kotki",
            "koty",
            "kot"
        ],
        "description": {
            "pl": ",catapi - Zwraca losowe zdjęcia kotka.",
            "en": ",catapi - Returns a random kitten photo."
        }
    },
    "dice": {
        "aliases": [
            "d",
            "roll"
        ],
        "description": {
            "pl": ",dice [i]d[n] - Rzuca [n] koścmi [i] razy.",
            "en": ",dice [i]d[n] - Throws [n] dices [i] times."
        }
    },
    "dogecoin": {
        "aliases": [
            "doge",
            "dge"
        ],
        "description": {
            "pl": ",dogecoin - Pokazuje aktualną cenę DogeCoinów.",
            "en": ",dogecoin - Shows current DogeCoin price."
        }
    },
    "evaluate": {
        "aliases": [
            "maths",
            "math",
            "eval",
            "e",
            "count"
        ],
        "description": {
            "pl": ",eval [argumenty] - Ewaluuje wyrażenie. Dostępny JSowy obiekt Math.",
            "en": ",eval [arguments] - Evaluates the expression. Object Math is allowed."
        }
    },
    "fivehundred_px": {
        "aliases": [
            "500",
            "px", {
                "alias": "nude",
                "options": {
                    "data": "nude"
                }
            }
        ],
        "description": {
            "pl": ",500px [tag] - Bot pobiera losowy obrazek z [tag].",
            "en": ",500px [tag] - Bot gets random [tag] image."
        }
    },
    "google": {
        "aliases": [
            "g",
            "szukaj"
        ],
        "description": {
            "pl": ",google [string] - Wyświetla wynik wyszukiwania [string]",
            "en": ",google [string] - Shows search result of [string]"
        }
    },
    "help": {
        "aliases": [
            "h"
        ],
        "description": {
            "pl": ",help [komenda] [język] - Wyświetla opis dla [komenda] w [języku].",
            "en": ",help [command] [lang] - Shows description for [command] in [lang]."
        }
    },
    "list": {
        "aliases": [
            "commands"
        ],
        "description": {
            "pl": ",list - Wyświetla listę komend.",
            "en": ",list - Lists all commands."
        }
    },
    "message": {
        "aliases": [
            "msg",
            "send"
        ],
        "description": {
            "pl": ",message [użytkownik] [wiadomość] - Wysyła [wiadomość] do [użytkownika].",
            "en": ",message [user] [message] - Sends [message] to [user]."
        }
    },
    "niggr": {
        "aliases": [
            "nigger",
            "nig"
        ],
        "description": {
            "pl": ",nigrr [url] - Returns nig.gr shortened url",
            "en": ",nigrr [url] - Returns nig.gr shortened url"
        }
    },
    "oboobs": {
        "aliases": [
            "boobs",
            "cycki",
            "boobies",
            "tits"
        ],
        "description": {
            "pl": ",oboobs [liczba <= 5] - Zwraca [liczba] zdjęć cycków.. Używa http://api.oboobs.ru/",
            "en": ",oboobs [number <= 5] - Returns [amount] of boobies photos. Uses http://api.oboobs.ru/"
        }
    },
    "pick": {
        "aliases": [
            "choose"
        ],
        "description": {
            "pl": ",pick [str1] [str2]... - Wyświetla posortowaną listę.",
            "en": ",pick [str1] [str2]... - Shows sorted list.."
        }
    },
    "say": {
        "aliases": [
            "s"
        ],
        "description": {
            "pl": ",say [string] - Bot wypowiada [string].",
            "en": ",say [string] - Bot says [string]."
        }
    },
    "shout": {
        "aliases": [],
        "description": {
            "pl": ",shout [string] - Bot wykrzykuje [string].",
            "en": ",shout [string] - Bot shouts [string]."
        }
    },
    "tumblr": {
        "aliases": [],
        "description": {
            "pl": ",tumblr [tag] - Bot pobiera losowy obrazek z [tag].",
            "en": ",tumblr [tag] - Bot gets random [tag] image."
        }
    },
    "complexMock": {
        "aliases": [{
            "alias": "complex",
            "options": {
                "data": "complex"
            }
        }],
        "description": {
            "pl": "Zamockowany opis",
            "en": "Mocked description"
        }
    }
};
// console.log(data.tumblr);
module.exports = data;