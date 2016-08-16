# nBot - extendable bot written in javascript#
[![Build Status](https://drone.io/github.com/Palid/nBot/status.png)](https://drone.io/github.com/Palid/nBot/latest) [![Code Climate](https://codeclimate.com/github/Palid/nBot.png)](https://codeclimate.com/github/Palid/nBot)

## Table of contents ##

* Table of contents
* Setup
* API
* List of current functions
* Why nBot


## Setup ##

### Requirements ###

nBot requires both `Node.js >= 0.10` and `MongoDB >= 2.4` to be installed in order to work. 

### Installation steps ###

* 1: Clone repository
* 2: Enter repository 
* 3: Type `npm install`
* 4: That's it!

### Configuration ###
To start bot up you need to create two files in `config` directory: `bot.js` and `oAuth.js`. To simplify the process, `config` directory already has `example.bot.js` file and `example.oAuth.js` file that you only need to copy and slightly modify for your own use. Remember though, that `oAuth.js` is required, even if it will be just a just name-changed example file. Options names should be self-explanatory, but for the sake of README, I'll list them anyways.

* `{irc} ` Options used by [node-irc library](https://github.com/williamwicks/nodeirc) on top which `nBot` is built on. For list of available options visit [node-irc documentation](http://node-irc.readthedocs.org/en/latest/API.html)
* `{options}`  Options object used by `nBot` itself, not required options are commented and prepended with `*`
    * `commandCharacter`  character (or string) on which if found the bot will execute commands
    * `defaultLang`  default language for command descriptions
    * `{urlScrapeTitle}`  Object with configuration options for urlScraping
        - `begin`  String prepended to the title 
        - `repost` String prepended to user's nickname that posted link for the first time
    * `root`  Your irc nickname - used for creation of database document with `root` permissions
    * `{database}`  Object with database configuration options
        - `type` Database `type`, currently the only supported is `mongodb`
        - `url` Database connection string
        - `*user` - Database user
        - `*password` Database password


## API ##
The `nBot` is built with an idea to easily extend his current public methods amount. At the moment `nBot` has an impressive amount of 22 public methods (private module for eval included) and 4 private methods. 

Adding new method is as easy as copying `example.method` file in `api` directory and adding your own functionality to the `method` variable. In the end save your file anywhere in api directory with filename same as call method for users.

#### In short ####
* Copy `api/example.method` anywhere to `api` folder and rename it to `yourNewMethod.js`.
* Add your logic into `method` variable.
* Change command's `defaults`: `description`, `aliases` and `level`
* Create docstring for your command
* Write test (or not) for your new command.
* If you'll somehow need private module for your functionality, feel free to create it by prepending `__` to it's name - it will be skipped on bot's startup. 
* That's it! New command will be automatically loaded on next bot's startup.

### List of functions ###
#### Public ####
* `8ball` Returns 8ballish posibility of provided action
* `evaluate` Evaluates provided string in virtual machine enviroment in forked process
* `alias` Returns all aliases for provided command
* `bible` Returns provided bible quote using [Bible API](http://labs.bible.org/api_web_service)
* `catapi` Returns a link to random cat picture using [catapi](http://thecatapi.com/)
* `dice` Returns called dice throws.
* `google` Returns first google result for provided string
* `help` Returns help for provided command
* `list` Lists all currently available methods
* `lmgtfy` Shows link to [Let Me Google This For You](http://lmgtfy.com) query
* `memo` Creates memo for a `user`.
* `message` Sends private message to a `user`
* `oboobs` Returns up to five links to pictures provided by [Open Boobs Project](http://oboobs.ru). NSFW!
* `pick` Returns pick order of provided strings.
* `say` Says the provided strings.
* `seen` Returns date when `user` was last seen.
* `shout` Shouts the provided string using [FIGLET](http://www.figlet.org/) 

#### Private ####
* `invite` Invites user to current channel
* `kick` Kicks user from current channel
* `topic` Changes current channel's topic
* `user` Users configuration collective command

### Why nBot? ###
I always really wanted to create an easily extandable irc bot that can be forked and hacked on by beginners. Right not the code isn't really tested, but it works well and is quite safe.
