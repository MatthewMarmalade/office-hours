const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

const graves = '```';
const padding = '\n\nControls:';
var target = null;
var main_map = null;
const playerChar = ['▲','◀','▼','▶'];
const empty = ' ';
const stone = '█';


const large_blank = '\
 _____________________________________________________________ \n\
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
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ \n';

const sixteen_blank = '\
  ______________________________  \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  \n';

const sixteen_mining = '\
  ______________________________  \n\
 |                              | \n\
 |       █                      | \n\
 |                          █   | \n\
 |                              | \n\
 |                              | \n\
 |                              | \n\
 |                    █         | \n\
 |                              | \n\
 |     █                        | \n\
 |                              | \n\
 |                              | \n\
 |                    █         | \n\
 |                              | \n\
 |        █                     | \n\
 |                              | \n\
 |                              | \n\
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  \n';

const small_house = '\
  ________  \n\
 |████████| \n\
 |██░░░░██| \n\
 |██░░@1██| \n\
 |█████▤██| \n\
  ▔▔▔▔▔▔▔▔  \n';

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
|  ▶ |\n\
|    |\n\
 ▔▔▔▔ \n';
const small_dungeon = toMessage('small_dungeon', small_dungeon_map);

var maps = {}
maps['small_dungeon'] = small_dungeon;
maps['large_dungeon'] = large_dungeon;

function toSecret(map) {
    const whitespace = map.split("\n").join("n").split(empty).join("e");
    const walls = whitespace.split("|").join("v").split("▔").join("h");
    const blocks = walls.split(stone).join("b");
    const players = blocks.split("▲").join("w").split("◀").join("a").split("▼").join("s").split("▶").join("d");
    return players;
}

function fromSecret(map) {
    const whitespace = map.split("n").join("\n").split("e").join(empty);
    const walls = whitespace.split("v").join("|").split("h").join("▔");
    const blocks = walls.split("b").join(stone);
    const players = blocks.split("w").join("▲").split("a").join("◀").split("s").join("▼").split("d").join("▶");
    return players;
}

function toMessage(name, map) {
    const secret = 'name.' + name + '-map.' + toSecret(map) + '\n';
    return graves + secret + graves + padding;
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
        
        console.log("Final Grid: " + this.grid.grid);
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
                if (char == playerChar[3]) {
                    this.player = new Player(j, i, char, "Unnamed Player");
                    console.log("Player '" + this.player.name + "'' Found At: (" + this.player.x + "," + this.player.y + ")");
                }
            }
        }
        return new Grid(grid, this.height, this.width);
    }
    gridToSecret() {
        var rows = [];
        var grid = this.grid.grid;
        for (var row = 0; row < grid.length; row++) {
            rows[row] = grid[row].join('');
        }
        var text = rows.join('\n') + '\n';
        return toSecret(text);
    }
    toText() {
        //Reconstructs the map into a piece of text that can be sent using the bot.
        const visible = this.visibleMap();
        const secret = 'name.' + this.name + '-map.' + this.gridToSecret() + '\n';
        const final = this.name + '\n' + graves + secret + visible + graves + padding;
        console.log("Final Output: " + final);
        return final;
    }
    visibleMap() {
        if (this.fog == null) this.fog = 3;
        const fogX = Math.floor(this.fog * 2);           //Adjusted because char height > width
        const minY = Math.max(0,this.player.y-this.fog);
        const maxY = Math.min(this.player.y+this.fog+1,this.height);
        const minX = Math.max(0,this.player.x-fogX);
        const maxX = Math.min(this.player.x+fogX+1,this.width);
        var rows = [];
        var visibleRows = this.grid.grid.slice(minY, maxY);
        for (var row = 0; row < visibleRows.length; row++) {
            var visibleCols = visibleRows[row].slice(minX, maxX);
            rows[row] = visibleCols.join('');
        }
        return rows.join('\n') + '\n';
    }
    playerW() {
        this.player.move(this.grid, playerChar[0]);
    }
    playerA() {
        this.player.move(this.grid, playerChar[1]);
    }
    playerS() {
        this.player.move(this.grid, playerChar[2]);
    }
    playerD() {
        this.player.move(this.grid, playerChar[3]);
    }
    playerMine() {
        if (this.grid.getTarget(this.player) == stone) {
            this.grid.setTarget(this.player, empty);
        }
    }
    playerBuild() {
        if (this.grid.getTarget(this.player) == empty) {
            this.grid.setTarget(this.player, stone);
        }
    }
}

class Grid {
    constructor(grid, height, width) {
        this.grid = grid;
        this.height = height;
        this.width = width;
    }
    getBlock(x,y) {
        if (x >= 0 && y >= 0 && x <= this.width+1 && y <= this.height+1) {
            return this.grid[y][x];
        }
    }
    setBlock(x,y,char) {
        if (x >= 0 && y >= 0 && x <= this.width+1 && y <= this.height+1) {
            this.grid[y][x] = char;
        }
    }
    getTarget(player) {
        const x = player.targetX(); const y = player.targetY();
        return this.getBlock(x,y);
    }
    setTarget(player, char) {
        const x = player.targetX(); const y = player.targetY();
        this.setBlock(x, y, char);
    }
}

class Player {
    constructor(x, y, char, name) {
        this.x = x; this.y = y; this.char = char; this.name = name;
    }
    facing(char) {
        return char == this.char;
    }
    targetX() {
        if (this.char == playerChar[1]) {
            return this.x - 1;
        } else if (this.char == playerChar[3]) {
            return this.x + 1;
        } else {
            return this.x;
        }
    }
    targetY() {
        if (this.char == playerChar[0]) {
            return this.y - 1;
        } else if (this.char == playerChar[2]) {
            return this.y + 1;
        } else {
            return this.y;
        }
    }
    move(grid, dir) {
        if (this.facing(dir)) {
            if (grid.getTarget(this) == empty) {
                grid.setTarget(this,this.char);
                grid.setBlock(this.x,this.y,empty);
                this.x = this.targetX(); this.y = this.targetY();
            }
        } else {
            this.char = dir;
            grid.setBlock(this.x,this.y,dir);
        }
        //console.log('Player: ' + this.name + ' Going: ' + dir + ' Results: ' + grid.gridToSecret());
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
                    .then(() => target.react('⛏️'))
                    .then(() => target.react('◼️'))
                    .then(() => console.log("New Map: " + main_map.name))
                    .catch(console.error);
            }
            break;
        case 'w':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerW();
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'a':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerA();
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 's':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerS();
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'd':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerD();
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'delete':
            if (target == null) {
                if (message.reference != null) {
                    channel.messages.fetch(message.reference.messageID)
                        .then(reply => reply.delete())
                        .catch(console.error);
                } else {
                    console.log('ERROR: delete called without target set! do nothing');
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
        if (target == null) {
            console.log('ERROR: Emoji ' + reaction._emoji.name + ' reacted without target set!');
            return;
        }
        switch (reaction._emoji.name) {
            case '⬆': main_map.playerW(); break;
            case '⬇️': main_map.playerS(); break;
            case '⬅️': main_map.playerA(); break;
            case '➡': main_map.playerD(); break;
            case '⛏️': main_map.playerMine(); break;
            case '◼️': main_map.playerBuild(); break;
            default:
                console.log("ERROR: Unknown Reaction: " + reaction._emoji.name); break;
        }
        target.edit(main_map.toText())
            .catch(console.error);
        reaction.users.remove(user.id);
    }
})

bot.login(config.token);