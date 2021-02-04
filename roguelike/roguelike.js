const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

//TEXT VARIABLES
const graves = '```';
const padding = '\n\n\nControls:';
var playerChar = {'w':'▲W','a':'◀A','s':'▼S','d':'▶D','▲W':'w','◀A':'a','▼S':'s','▶D':'d'};
var empty = ['e','  '];		//{'b':'e','f':' '};
var stone = ['s','██'];		//{'b':'s','f':'█'};
var walls = ['','░░'];		//{'b':'', 'f':'░'};//'▞';//'▒';
var nline = ['n','\n'];		//{'b':'n','f':'\n'};

// var playerChar = {'w':'▲▲','a':'◀◀','s':'▼▼','d':'▶▶','▲▲':'w','◀◀':'a','▼▼':'s','▶▶':'d'};
// const empty = ' ';
// const stone = '██';
// const walls = '░░';//'▞';//'▒';
const standard_inventory = 'Actions: **100** | Pickaxe: **64** | Potatoes: **8** | Stone: **16** | Wood: **0** | Iron: **0** | ';

//MESSAGE AND MAP VARIABLES
var target = null;
var main_map = null;

//MAP TEXTS
const large_blank = '\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n\
                                                             \n';

const sixteen_blank_map = '\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n\
                              \n';
const sixteen_blank = toMessage('sixteen_blank', sixteen_blank_map, 6, [12], [7], ['d']);

const sixteen_mining_map = '\
                              \n\
       █                      \n\
                ███       █   \n\
    █          ███            \n\
                              \n\
                              \n\
                    █         \n\
 █                            \n\
     █          █             \n\
      ██           ██         \n\
               █              \n\
                    █     █   \n\
                         ███  \n\
        █                     \n\
             █      █         \n\
                              \n';
const sixteen_mining = toMessage('sixteen_mining', sixteen_mining_map, 4, [12], [7], ['d']);

const small_house_map = '\
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
|       |                           |                         |\n\
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
const large_dungeon = toMessage('large_dungeon', large_dungeon_map, 4, [10], [10], ['d']);

const small_dungeon_map = '\
      \n\
      \n\
      \n';
const small_dungeon = toMessage('small_dungeon', small_dungeon_map, 3, [2], [1], ['d']);

var maps = {}
maps['small_dungeon'] = small_dungeon;
maps['large_dungeon'] = large_dungeon;
maps['16_blank'] = sixteen_blank;
maps['16_mining'] = sixteen_mining;

function toSecret(map) {
    const whitespace = map.split(nline[1]).join(nline[0]).split(empty[1]).join(empty[0]);
    const blocks = whitespace.split(stone[1]).join(stone[0]);
    return blocks;
}

function fromSecret(map) {
    const whitespace = map.split(nline[0]).join(nline[1]).split(empty[0]).join(empty[1]);
    const blocks = whitespace.split(stone[0]).join(stone[1]);
    return blocks;
}

function toMessage(name, map, fog, xs, ys, ds) {
    const secret = 'name.' + name + '-fog.' + fog + '-xs.' + xs.join('.') + '-ys.' + ys.join('.') + '-ds.' + ds.join('.') + '-map.' + toSecret(map) + '\n';
    return graves + secret + graves + standard_inventory;
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
        this.inventory = new Inventory(no_graves[2]);
        this.secret = no_graves[1].split('\n')[0];
        var secrets = this.secret.split('-');
        var xs; var ys; var ds;
        for (var i = 0; i < secrets.length; i++) {
            const s = secrets[i].split('.');
            const key = s.shift();
            switch (key) {
            case 'name':
                console.log("Map Name: " + s[0]);
                this.name = s[0]; break;
            case 'map':
                console.log("Map Map: " + s[0]);
                this.grid = this.secretToGrid(s[0]); break;
            case 'fog':
                console.log("Map Fog: " + s[0]);
                this.fog = Number (s[0]); break;
            case 'xs':
            	console.log("Map xs: " + s);
            	xs = s; break;
            case 'ys':
            	console.log("Map ys: " + s);
            	ys = s; break;
            case 'ds':
            	console.log("Map ds: " + s);
            	ds = s; break;
            default:
                console.log('ERROR: Unknown secret: ' + key + ': ' + s); break;
            }
        }

        // for (var i = 0; i < xs.length; i++) {

        // }
        this.player = new Player (xs[0], ys[0], ds[0], "Player 1", this.inventory);
        
        console.log("Final Grid: " + this.grid.grid);
        console.log("MAP LOADED")
    }
    secretToGrid(secret) {
        //var rows = fromSecret(secret).split('\n');
        var rows = secret.split('n');
        var char;
        var length;
        this.height = rows.length - 1;
        this.width = rows[0].length;
        console.log("Map Height: " + this.height + ", Map Width: " + this.width);
        var grid = [];
        for (var i = 0; i < rows.length-1; i++) {
            grid[i] = rows[i].split('');
            if (rows[i].length != this.width) {
                console.log("ERROR: Row " + i + " width: " + rows[i].length + " != " + this.width);
                return;
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
        var text = rows.join('n') + 'n';
        //console.log("LOG: GRIDTOSECRET: " + text);
        return text;
    }
    toText() {
        //Reconstructs the map into a piece of text that can be sent using the bot.
        const visible = this.visibleMap();
        const secret = 'name.' + this.name + '-fog.' + this.fog + '-xs.' + [this.player.x] + '-ys.' + [this.player.y] + '-ds.' + [this.player.char] + '-map.' + this.gridToSecret() + '\n';
        const final = this.name + '\n' + graves + secret + visible + graves + this.inventory.toText() + padding;
        //console.log("LOG: toText Complete: " + /*final + */"\ntoText Characters: " + final.length);
        return final;
    }
    visibleMap() {
        if (this.fog == null) this.fog = 5; //radius of visible square. 
        const fogX = Math.floor(this.fog * 2);           //Adjusted because char height > width
        const minY = this.player.y - this.fog;
        const maxY = this.player.y + this.fog + 1;
        const minX = this.player.x - fogX;
        const maxX = this.player.x + fogX + 1;
        var visible = [];
        for (var gridY = minY; gridY < maxY; gridY++) {
        	const visY = gridY - minY;
        	visible[visY] = [];
        	//console.log("TEST: Moved to y=" + gridY + ". Grid At This Height: " + this.grid.grid[gridY]);
        	for (var gridX = minX; gridX < maxX; gridX++) {
        		const visX = gridX - minX;
        		if (gridY == this.player.y && gridX == this.player.x) {
        			//console.log("TEST: Found Player at (" + gridX + ',' + gridY + ').');
        			visible[visY][visX] = playerChar[this.player.char];
        		} else if (gridX >= 0 && gridX < this.width && gridY >= 0 && gridY < this.height) {
        			//console.log("TEST: (" + gridX + ',' + gridY + ') Within Grid.');
        			visible[visY][visX] = this.grid.grid[gridY][gridX];
        		} else {
        			//console.log("TEST: (" + gridX + ',' + gridY + ') Outside Grid, using Walls.');
        			visible[visY][visX] = walls[1];
        		}
        	}
        	visible[visY] = visible[visY].join('');
        }
        visible = visible.join('\n') + '\n';
        //console.log("TEST: OUTPUT OF VISIBLE MAP: ==========\n" + visible);
        //console.log("TEST: ==========")
        //console.log("TEST: Grid after modification: \n" + this.grid.grid);
        return fromSecret(visible);
    }
    playerMove(dir) {
        this.player.move(this.grid, dir);
    }
    playerMine() {
        this.player.mine(this.grid);
    }
    playerBuild() {
        this.player.build(this.grid);
    }
}

class Grid {
    constructor(grid, height, width) {
        this.grid = grid;
        this.height = height;
        this.width = width;
    }
    getBlock(x,y) {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
        	//console.log("TEST: x:" + x + ",y:" + y + ". Width:" + this.width + ", Height:" + this.height);
            return this.grid[y][x];
        } else {
        	console.log("ERROR: x:" + x + ",y:" + y + " is invalid. Width:" + this.width + ", Height:" + this.height);
        }
    }
    setBlock(x,y,char) {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
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
    constructor(x, y, char, name, inventory) {
        this.x = Number(x); this.y = Number(y); this.char = char; this.name = name; this.inventory = inventory;
    }
    facing(char) {
        return char == this.char;
    }
    targetX() {
        if (this.char == 'a') {
            return this.x - 1;
        } else if (this.char == 'd') {
            return this.x + 1;
        } else {
            return this.x;
        }
    }
    targetY() {
        if (this.char == 'w') {
            return this.y - 1;
        } else if (this.char == 's') {
            return this.y + 1;
        } else {
            return this.y;
        }
    }
    move(grid, dir) {
    	//console.log('TEST: Player: ' + this.name + ' Going: ' + dir);
        if (this.facing(dir)) {
        	//console.log('TEST: Target: ' + grid.getTarget(this));
            if (grid.getTarget(this) == empty[0]) {
                if (this.inventory.enough('Actions',1)) {
                    //grid.setTarget(this,this.char);
                    //grid.setBlock(this.x,this.y,empty);
                    this.x = this.targetX(); this.y = this.targetY();
                    this.inventory.addAmount('Actions',-1);
                }
            }
        } else {
            this.char = dir;
            //grid.setBlock(this.x,this.y,dir);
        }
    }
    mine(grid) {
        if (grid.getTarget(this) == stone[0]) {
            if (this.inventory.enough('Actions',1) && this.inventory.enough('Pickaxe',1)) {
                grid.setTarget(this, empty[0]);
                this.inventory.addAmount('Actions',-1);
                this.inventory.addAmount('Pickaxe',-1);
                this.inventory.addAmount('Stone',1);
            }
        }
    }
    build(grid) {
        if (grid.getTarget(this) == empty[0]) {
            if (this.inventory.enough('Actions',1) && this.inventory.enough('Stone',1)) {
                grid.setTarget(this, stone[0]);
                this.inventory.addAmount('Actions',-1);
                this.inventory.addAmount('Stone',-1);
                this.inventory.addAmount('Pickaxe',1);
            }
        }
    }
}

class Inventory {
    constructor(inventory) {
        if (inventory != '') {
            var items = inventory.split('** | ');
            items = items.slice(0,items.length-1);
            //console.log('TEST: Items: ' + items);
            var map = {};
            for (var i = 0; i < items.length; i++) {
                const item = items[i].split(': **');
                map[item[0]] = Number(item[1]);
            }
            this.map = map;
            console.log("LOG: New Inventory: ");
            console.log(map);
        } else {
            console.log("ERROR: Inventory cannot be loaded.");
            this.map = null;
        }
    }
    toText() {
        //console.log("LOG: toText called. Map: " + this.map);
        var text = [];
        if (this.map != null) {
            for (var name in this.map) {
                text.push(name + ': **' + String(this.map[name]));
            }
            return text.join('** | ') + '** | ';
        } else {
            console.log("ERROR: Inventory not loaded.");
            return '';
        }
    }
    getAmount(item_name) {
        if (this.map[item_name] != null) {
            return this.map[item_name];
        } else {
            console.log("ERROR: '" + item_name + "' is not a valid item name.");
            return 0;
        }
    }
    enough(item_name,amount) {
        return this.getAmount(item_name) >= amount;
    }
    setAmount(item_name, amount) {
        if (this.map[item_name] != null) {
            this.map[item_name] = amount;
        } else {
            console.log("ERROR: '" + item_name + "' is not a valid item name.");
        }
    }
    addAmount(item_name, amount) {
        if (this.map[item_name] != null) {
            this.map[item_name] += amount;
        } else {
            console.log("ERROR: '" + item_name + "' is not a valid item name.");
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
    main_map.fromText(small_dungeon);
    console.log("Converted back to text:\n" + main_map.toText());
})

bot.on('message', message => {
    //console.log('LOG: New Message: ' + message.content);

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
                main_map.playerMove('w');
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'a':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerMove('a');
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 's':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerMove('s');
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'd':
            if (target == null) {
                console.log('ERROR: Command ' + command + ' called without target set!');
            } else {
                main_map.playerMove('d');
                target.edit(main_map.toText())
                    .catch(console.error);
            } break;
        case 'text':
        	if (target == null) {
                if (message.reference != null) {
                    channel.messages.fetch(message.reference.messageID)
                        .then(reply => console.log("TEXT: \n" + reply.content + "\n---- Characters: " + reply.content.length))
                        .catch(console.error);
                } else {
                    console.log('ERROR: text called without target set! do nothing');
                }
            } else {
                console.log("TEXT: \n" + target.content);
            }
            break;
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
            case '⬆': main_map.playerMove('w'); break;
            case '⬅️': main_map.playerMove('a'); break;
            case '⬇️': main_map.playerMove('s'); break;
            case '➡': main_map.playerMove('d'); break;
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