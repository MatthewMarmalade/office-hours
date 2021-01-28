# office-hours
(needs a new name?)

## Basic Description
Put formally: A Discord bot (or family of bots) for managing large-scale unicode-based state machines.
Put informally: A Discord bot that lets you play small 2d games in an ASCII art style with friends. Potential applications include basic roguelike games, map modelling for TTRPGs, and basic, limited, efficient copresence in an isolating age (hence 'office hours' - refers to the ability to 'hang out' within a 'space', available for interaction but not actively requesting/enforcing it.)

## Capabilities (will likely update as project develops)
### Current Capabilities Proven:
- Rendering of monospaced 'map'
- Recovery of data on loss of connection; uses messages in discord itself to store its data so that no particular 'server' storage is needed.
- Edit-based system of updating game world
- Basic commands to move a little player symbol around a 10x10 grid; player can use commands to navigate a simple maze

### Planned Capabilities:
- Map editing entirely within Discord
- Map copy/import/export
- Permissioning/Roles to handle multiplayer interactions
- Multi-world behaviour (helps with the render limit and character limit (2000)
- (Maybe) not just state editing, but state machine editing as well? I.e. ability to submit replacement rules, for instance.

## Current Goals
- Establish repository (this), new bot (current capabilities demonstrated on an experiments bot) and better workflow.
- Grid management system: coordinates within the world, mapped back and forth between the textual representation.
- Automatic re-copying; active map should be loaded into the first slot.
- Command management (there are probably going to be a lot)
- Fog of War: Post grid-management system; separate true grid from render without loss of data.
- Test emoji reactions to submit commands as a potentially faster/cleaner system. Might have more edge cases though.
- Current Push Goal: Roguelike! Uses grid management, uses fog of war, seeded world generation, single-direction traversal of 'levels', class specializations, items, visible rng, basic combat/movement, superhot rules to deal with latency. Naming characters, inventory.
