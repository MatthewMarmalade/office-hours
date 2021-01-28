const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

const graves = '```';
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

const large_dungeon_map = '\
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
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ \n';
const large_dungeon = toMessage('large_dungeon', large_dungeon_map);

const small_dungeon_map = '\
 ____ \n\
|    |\n\
|  @ |\n\
|    |\n\
 ▔▔▔▔ \n';
const small_dungeon = toMessage('small_dungeon', small_dungeon_map);

var target = null;
var main_map = null;
const playerChar = '@';
const empty = ' ';
var maps = {}
maps['small_dungeon'] = small_dungeon;
maps['large_dungeon'] = large_dungeon;

function toSecret(map) {
    return map.split("\n").join("n").split(' ').join("e").split("|").join("v").split("▔").join("h").split("@").join("p");
}

function fromSecret(map) {
    return map.split("n").join("\n").split("e").join(' ').split("v").join("|").split("h").join("▔").split("p").join("@");
}

function toMessage(name, map) {
    const secret = 'name.' + name + '-map.' + toSecret(map) + '\n';
    return graves + secret + graves;
}

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
        console.log("LOADING NEW MAP");
        const no_graves = text.split('```');
        if (no_graves.length != 3) {
            console.log('Incorrect grave wrapping.'); 
            return;
        }
        this.secret = no_graves[1].split('\n')[0];
        var secrets = this.secret.split('-');
        var s;
        var rows;
        for (var i = 0; i < secrets.length; i++) {
            s = secrets[i].split('.');
            switch (s[0]) {
            case 'name':
                this.name = s[1]; 
                console.log("Map Name: " + this.name); break;
            case 'map':
                console.log("Map Secret: " + s[1]);
                this.grid = this.secretToGrid(s[1]); break;
            default:
                console.log('ERROR: Unknown secret: ' + s); break;
            }
        }
        
        console.log("Final Grid: " + this.grid);
        console.log("MAP LOADED")
    }
    secretToGrid(secret) {
        var rows = fromSecret(secret).split('\n');
        var char;
        var length;
        this.height = rows.length;
        this.width = rows[0].length;
        console.log("Map Height: " + this.height + ", Map Width: " + this.width);
        var grid = [];
        for (var i = 0; i < rows.length-1; i++) {
            grid[i] = rows[i].split('');
            if (rows[i].length != this.width) {
                console.log("Row " + i + " width: " + rows[i].length + " != " + this.width);
                return;
            }
            //console.log("Row " + i + ": " + grid[i]);
            for (var j = 0; j < grid[i].length; j++) {
                //passing over every character...
                char = grid[i][j];
                if (char == playerChar) {
                    this.playerX = j;
                    this.playerY = i;
                    console.log("Player Found At: (" + this.playerX + "," + this.playerY + ")");
                }
            }
        }
        return grid;
    }
    gridToSecret() {
        var rows = [];
        for (var row = 0; row < this.grid.length; row++) {
            rows[row] = this.grid[row].join('');
        }
        var text = rows.join('\n') + '\n';
        return toSecret(text);
    }
    toText() {
        //Reconstructs the map into a piece of text that can be sent using the bot.
        const visible = this.visibleMap();
        const secret = 'name.' + this.name + '-map.' + this.gridToSecret() + '\n';
        const final = this.name + '\n' + graves + secret + visible + graves;
        //console.log("Final Output: " + final);
        return final;
    }
    visibleMap() {
        if (this.fog == null) this.fog = 3;
        const fogX = Math.floor(this.fog * 2);           //Adjusted because char height > width
        const minY = Math.max(0,this.playerY-this.fog);
        const maxY = Math.min(this.playerY+this.fog+1,this.height);
        const minX = Math.max(0,this.playerX-fogX);
        const maxX = Math.min(this.playerX+fogX+1,this.width);
        var rows = [];
        var visibleRows = this.grid.slice(minY, maxY);
        for (var row = 0; row < visibleRows.length; row++) {
            var visibleCols = visibleRows[row].slice(minX, maxX);
            rows[row] = visibleCols.join('');
        }
        return rows.join('\n') + '\n';
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
    //console.log(small_dungeon);
    main_map = new Map();
    //main_map.fromText(small_dungeon);
    //console.log("Converted back to text:\n" + main_map.toText());
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
                    .then(() => target.react('⬆'))
                    .then(() => target.react('⬇️'))
                    .then(() => target.react('⬅️'))
                    .then(() => target.react('➡'))
                    .then(() => console.log("New Map: " + main_map.name))
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
                if (message.reference != null) {
                    channel.messages.fetch(message.reference.messageID)
                        .then(reply => reply.delete())
                        .catch(console.error);
                } else {
                    //console.log('ERROR: delete called without target set! do nothing');
                }
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

bot.on('messageReactionAdd', (reaction, user) => {
    //console.log(reaction._emoji.name);
    if (reaction.message == target && !user.bot) {
        switch (reaction._emoji.name) {
            case '⬆':
                if (target == null) {
                    console.log('ERROR: Emoji ' + reaction._emoji.name + ' reacted without target set!');
                } else {
                    const success = main_map.playerW();
                    if (success) {
                        target.edit(main_map.toText())
                            .catch(console.error);
                    }
                }
                break;
            case '⬇️':
                if (target == null) {
                    console.log('ERROR: Emoji ' + reaction._emoji.name + ' reacted without target set!');
                } else {
                    const success = main_map.playerS();
                    if (success) {
                        target.edit(main_map.toText())
                            .catch(console.error);
                    }
                }
                break;
            case '⬅️':
                if (target == null) {
                    console.log('ERROR: Emoji ' + reaction._emoji.name + ' reacted without target set!');
                } else {
                    const success = main_map.playerA();
                    if (success) {
                        target.edit(main_map.toText())
                            .catch(console.error);
                    }
                }
                break;
            case '➡':
                if (target == null) {
                    console.log('ERROR: Emoji ' + reaction._emoji.name + ' reacted without target set!');
                } else {
                    const success = main_map.playerD();
                    if (success) {
                        target.edit(main_map.toText())
                            .catch(console.error);
                    }
                }
                break;
            default:
                console.log("ERROR: Unknown Reaction: " + reaction._emoji.name); break;
        }
        reaction.users.remove(user.id);
    }
})

bot.login(config.token);