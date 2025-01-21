const { Task, TaskManager } = require('./taskManager');
const config = require('config');

class SpawnManager {
    constructor() {
        this.TaskManager = new TaskManager();
        this.updateLocalData();
    }

    updateLocalData() {
        this.allCreeps = _.filter(Game.creeps);
        this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        this.haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');
        this.builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        this.claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
        this.attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');
    }

    updateSpawners() {
        for(var name in Game.spawns ) { 
            let spawner = Game.spawns[name];

            if( spawner.spawning) {
                var spawningCreep = Game.creeps[spawner.spawning.name];
                spawner.room.visual.text( '🛠️' + spawningCreep.memory.role, spawner.pos.x + 1, spawner.pos.y, {align: 'left', opacity: 0.8});
            } else {
                this.manageHarvesters(spawner);
                this.manageHaulers(spawner);
                this.manageUpgraders(spawner);
                this.manageClaimers(spawner);
                this.manageBuilders(spawner);
            }   
        }
        
        this.updateLocalData();
        this.memoryCleanup();
    }

    manageHarvesters(spawner){
        if(this.harvesters.length < config.MAX_HARVESTERS) {
            if( spawner.room.energyAvailable >= config.getBuildCost(config.HARVESTER_BUILD) ) {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    spawner.spawnCreep(config.getBuild(config.HARVESTER_BUILD), newName, {memory: {role: 'harvester'}});
            }
            else {
                console.log('Harvesters below maximum [' + this.harvesters.length + '/' + config.MAX_HARVESTERS + '] but there is not enough energy availible. [' + spawner.room.energyAvailable + ']');
            }
        }
    }

    manageHaulers(spawner) {
        if(this.haulers.length < config.MAX_HAULERS) {
            if( spawner.room.energyAvailable >= config.getBuildCost(config.HAULER_BUILD) ) {
                var newName = 'Hauler' + Game.time;
                console.log('Spawning new haulers: ' + newName);
                spawner.spawnCreep(config.getBuild(config.HAULER_BUILD), newName, {memory: {role: 'hauler'}});
            }
            else {
                console.log('Haulers below maximum [' + this.haulers.length + '/' + config.MAX_HAULERS + '] but there is not enough energy availible. [' + spawner.room.energyAvailable + ']');
            }
        }        
    }

    manageUpgraders(spawner) {
        if(this.upgraders.length < config.MAX_UPGRADERS ) {
            if( spawner.room.energyAvailable >= config.getBuildCost(config.UPGRADE) ) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawner.spawnCreep(config.getBuild(config.UPGRADER_BUILD), newName, {memory: {role: 'upgrader'}});
            }
            else {
                console.log('Upgraders below maximum [' + this.upgraders.length + '/' +config.MAX_UPGRADERS + '] but there is not enough energy availible. [' + spawner.room.energyAvailable + ']');
            }
        }
    }

    manageClaimers(spawner) {
        if(this.claimers.length < config.MAX_CLAIMERS ) {
            if( spawner.room.energyAvailable >= config.getBuildCost(config.CLAIMER_BUILD) ) {
                var newName = 'Claimer' + Game.time;
                console.log('Spawning new claimer: ' + newName);
                spawner.spawnCreep(config.getBuild(config.CLAIMER_BUILD), newName, {memory: {role: 'claimer', targetFlag: 'Capture'}});
            }
            else {
                console.log('Claimers below maximum [' + this.claimers.length + '/' +config.MAX_CLAIMERS + '] but there is not enough energy availible. [' + spawner.room.energyAvailable + ']');
            }
        }
    }

    manageBuilders(spawner) {
        if(this.builders.length < config.MAX_BUILDERS ) {
            var targets = spawner.room.find(FIND_CONSTRUCTION_SITES)
                
            if( targets.length  || config.IGNORE_CON_REQ == true )
            {
                if( spawner.room.energyAvailable >= config.getBuildCost(config.BUILDER_BUILD) ) {
                    var newName = 'Builder' + Game.time;
                    console.log('Construction sites availible, spawning new builders: ' + newName);
                    spawner.spawnCreep(config.getBuild(config.BUILDER_BUILD), newName, {memory: {role: 'builder'}});
                }
                else {
                    console.log('Builders below maximum [' + this.builders.length + '/' + config.MAX_BUILDERS + '] but there is not enough energy availible. [' + spawner.room.energyAvailable + ']');
                }
            }
            else {
                console.log('Builders below maximum [' + this.builders.length + '/' + config.MAX_BUILDERS + '] but there are no construction sites around to make it worth it.');
            }
        }
    }

    findSpawners() {
        let allSpawners = Game.spawns;
      
        let spawnerNames = Object.keys(allSpawners);
      
        return spawnerNames.map(name => allSpawners[name]);
    }

    memoryCleanup() {
        for(var name in Memory.creeps)
        {
            if(!Game.creeps[name])
            {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
}

module.exports = SpawnManager;