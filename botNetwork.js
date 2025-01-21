const CreepManager = require('./creepManager');
const SpawnManager = require('./spawnManager');

class BotNetwork {
    constructor() {
        this.spawnManager = new SpawnManager();
        this.creepManager = new CreepManager();

        this.update();
    }

    update() {
        this.updateGameData();
        this.updateBotNet();
    }
    
    updateGameData(){
        this.creeps = Game.creeps;
        this.spawns = Game.spawns;
        this.rooms = Game.rooms;
        this.memory = Memory;
    }

    updateBotNet() {
        this.spawnManager.updateSpawners();
        this.creepManager.updateCreeps();
    }
}

module.exports = BotNetwork;