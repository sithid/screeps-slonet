class SpawnManager {
    constructor() {
    }
    
    updateSpawns() {
        for(var name in Game.spawns ) { 
            if( Game.spawns[name].spawning) {
                var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text( '🛠️' + spawningCreep.memory.role, Game.spawns['Spawn1'].pos.x + 1, Game.spawns['Spawn1'].pos.y, {align: 'left', opacity: 0.8});
            }
        }
    }
}

module.exports = SpawnManager;