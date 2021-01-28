const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

const large_blank = '```large_blank\n\
 _____________________________________________________________\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
|                                                             |\n\
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\
```';

const large_dungeon = '```large_dungeon\n\
 _____________________________________________________________ \n\
|                                      ____________           |\n\
|                                     |            |          |\n\
|                                     |            |          |\n\
|                 __________________   ▔| |▔▔▔▔▔▔▔▔           |\n\
|                |                  |___| |                   |\n\
|                |                        |                   |\n\
|        _____   |                  |▔▔▔▔▔                    |\n\
|       |     |__|                  |                         |\n\
|       |  @                        |                         |\n\
|       |     |▔▔|                  |                         |\n\
|        ▔▔▔▔▔   |                  |                         |\n\
|                |                  |                         |\n\
|                 ▔▔▔▔▔▔▔| |▔▔▔▔▔▔▔▔                          |\n\
|                  ______| |   ___________________            |\n\
|                 |        |  |                   |           |\n\
|                 | |▔▔▔▔▔▔   |                   |           |\n\
|                 | |_________|                   |           |\n\
|                 |                               |           |\n\
|                  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔            |\n\
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ \n\
```';

const small_dungeon = '```small_dungeon\n\
 ____ \n\
|    |\n\
|  @ |\n\
|    |\n\
 ▔▔▔▔ \n\
```'

var target = null;
var main_map = null;
const playerChar = '@';
const empty = ' ';
var maps = {}
maps['small_dungeon'] = small_dungeon;
maps['large_dungeon'] = large_dungeon;

//A Map needs a grid, a border, a title...
class Map {
    constructor() {
        //this.name = name;
        console.log("New Map!");
    }
    fromText(text) {
        //parses text into a map
        //find the first instance of three backticks, remove them
        //find everything before the first newline => secret information
        //everything else until the last three backticks => the grid
        //done!
        const no_graves = text.split('```');
        if (no_graves.length != 3) return;
        var rows = no_graves[1].split('\n');
        this.secret = rows.shift();
        this.name = this.secret; //Temporary!
        rows = rows.slice(0,rows.length);
        var char;
        var length;
        this.height = rows.length;
        this.width = rows[0].length;
        var grid = [];
        for (var i = 0; i < rows.length-1; i++) {
            grid[i] = rows[i].split('');
            if (rows[i].length != this.width) {
                console.log("Row " + i + " width: " + rows[i].length + " != " + this.width);
                return;
            }
            for (var j = 0; j < grid[i].length; j++) {
                //passing over every character...
                char = grid[i][j];
                if (char == playerChar) {
                    this.playerX = j;
                    this.playerY = i;
                }
            }
        }
        this.grid = grid;
        console.log("Map " + this.name + " Loaded With: {\nsecret=" + this.secret + ",\nplayer=(" + this.playerX + "," + this.playerY + "),\nheight=" + this.height + ", width=" + this.width + "\ngrid=" + this.grid + "}");
    }
    toText() {
        //Reconstructs the map into a piece of text that can be sent using the bot.
        var rows = [];
        for (var row = 0; row < this.grid.length; row++) {
            rows[row] = this.grid[row].join('');
        }
        var text = rows.join('\n');
        return '```' + this.secret + '\n' + text + '\n```';
    }
    playerW() {
        if (this.grid[this.playerY-1][this.playerX] == empty) {
            this.grid[this.playerY-1][this.playerX] = playerChar;
            this.grid[this.playerY][this.playerX] = empty;
            this.playerY -= 1;
            return true;
        } else {
            return false;
        }
    }
    playerA() {
        if (this.grid[this.playerY][this.playerX-1] == empty) {
            this.grid[this.playerY][this.playerX-1] = playerChar;
            this.grid[this.playerY][this.playerX] = empty;
            this.playerX -= 1;
            return true;
        } else {
            return false;
        }
    }
    playerS() {
        if (this.grid[this.playerY+1][this.playerX] == empty) {
            this.grid[this.playerY+1][this.playerX] = playerChar;
            this.grid[this.playerY][this.playerX] = empty;
            this.playerY += 1;
            return true;
        } else {
            return false;
        }
    }
    playerD() {
        if (this.grid[this.playerY][this.playerX+1] == empty) {
            this.grid[this.playerY][this.playerX+1] = playerChar;
            this.grid[this.playerY][this.playerX] = empty;
            this.playerX += 1;
            return true;
        } else {
            return false
        }
    }
}

bot.once('ready', () => {
    console.log('Map-Bot Logged In And Ready!');
    //console.log(basic_dungeon.split('asdf'));
    //console.log(basic_dungeon.split('\n'));
    //map = new Map('test');
    //map.fromText(large_dungeon);
    //console.log("Converted back to text:\n" + map.toText());
    main_map = new Map();
})

bot.on('message', message => {
    console.log('LOG: New Message: ' + message.content);

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    //ignore non-prefixed messages or messages coming from bots

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    const channel = message.channel;
    console.log('Command Name: ' + command + ', Arguments: [' + args + ']');

    switch (command) {
        case 'map':
            if (message.reference != null) {
                channel.messages.fetch(message.reference.messageID)
                    .then(reply => target = reply)
                    .then(reply => main_map.fromText(reply.content))
                    .then(reply => console.log("Loaded Map: " + main_map.name))
                    .catch(console.error);
            } else {
                map_name = args.shift();
                if (maps[map_name] != null) {
                    main_map.fromText(maps[map_name]);
                } else {
                    main_map.fromText(small_dungeon);
                }
                channel.send(main_map.toText())
                    .then(map => target = map)
                    .then(map => console.log("New Map: " + main_map.name))
                    .catch(console.error);
            }
            break;
        case 'w':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                const success = main_map.playerW();
                if (success) {
                    target.edit(main_map.toText())
                        .catch(console.error);
                }
            }
            break;
        case 'a':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                const success = main_map.playerA();
                if (success) {
                    target.edit(main_map.toText())
                        .catch(console.error);
                }
            }
            break;
        case 's':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                const success = main_map.playerS();
                if (success) {
                    target.edit(main_map.toText())
                        .catch(console.error);
                }
            }
            break;
        case 'd':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                const success = main_map.playerD();
                if (success) {
                    target.edit(main_map.toText())
                        .catch(console.error);
                }
            }
            break;
        case 'delete':
            if (target == null) {
                console.log('ERROR: delete called without target set! do nothing');
            } else {
                target.delete()
                    .then(deleted => console.log('Map Deleted: ' + deleted.content))
                    .then(target = null)
                    .then(main_map = new Map())
                    .catch(console.error);
            }
            break;
        default:
            console.log("ERROR: Unknown Command: " + command);
            break;
    }
    message.delete();
})

bot.login(config.token);