const MinionController = require('./minionController');
var config = require('config');

const IGNORE_CON_REQ = true;

class CreepManager {
    constructor() {
        this.updateBotData();
    }
    
    updateCreeps() {
        this.updateBotData();
        this.printBotData();
        this.spawnCreeps();
        this.handleRoles();
        this.memoryCleanup();
    }

    updateBotData() {
        this.allCreeps = _.filter(Game.creeps);
        this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        this.haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');
        this.builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        this.claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
        this.attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');
        this.totalEnergy = config.getTotalEnergyAvailable(Game.spawns['Spawn1'].room);
        this.roomEnergy = Game.spawns['Spawn1'].room.energyAvailable;
    }

    printBotData() {
        var log = '';
        log += '\n        SloNet BotNet Information';
        log += '\n             -=Screep Data=-';
        log += '\n   Harvesters: ' + this.harvesters.length + '/' +  config.MAX_HARVESTERS;
        log += '\tUpgraders: ' + this.upgraders.length + '/' +  config.MAX_UPGRADERS;
        log += '\n     Builders: ' + this.builders.length + '/' +  config.MAX_BUILDERS;
        log += '\t Claimers: ' + this.claimers.length + '/' +  config.MAX_CLAIMERS;
        log += '\n      Haulers: ' + this.haulers.length + '/' +  config.MAX_HAULERS;
        log += '\tAttackers: ' + this.attackers.length + '/' +  config.MAX_ATTACKERS;
        log += '\n Total Creeps: ' + this.allCreeps.length + '/' + ( config.MAX_HARVESTERS + config.MAX_HAULERS + config.MAX_ATTACKERS + config.MAX_UPGRADERS + config.MAX_BUILDERS + config.MAX_CLAIMERS );
        
        if( Game.spawns['Spawn1'].spawning )
        {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            
            log += '     Spawning: ' + spawningCreep.name;
        }
        else
            log += '     Spawning: Idle';
        
        log += '\nEnergy Stored: ' + this.totalEnergy;
        log += '    Containers: ' + ( this.totalEnergy - this.roomEnergy );
        log += '\t     Room: ' + this.roomEnergy;

        console.log( log );
    }

    spawnCreeps() {
        if(!Game.spawns['Spawn1'].spawning)
        {        
            if(this.harvesters.length < config.MAX_HARVESTERS)
            {
                if( Game.spawns['Spawn1'].room.energyAvailable >= config.getBuildCost(config.HARVESTER_BUILD) )
                {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(config.getBuild(config.HARVESTER_BUILD), newName, {memory: {role: 'harvester'}});
                }
                else
                {
                    console.log('Harvesters below maximum [' + this.harvesters.length + '/' + config.MAX_HARVESTERS + '] but there is not enough energy availible. [' + Game.spawns['Spawn1'].room.energyAvailable + ']');
                }
            }
            if(this.haulers.length < config.MAX_HAULERS)
            {
                if( Game.spawns['Spawn1'].room.energyAvailable >= config.getBuildCost(config.HAULER_BUILD) )
                {
                    var newName = 'Hauler' + Game.time;
                    console.log('Spawning new haulers: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(config.getBuild(config.HAULER_BUILD), newName, {memory: {role: 'hauler'}});
                }
                else
                {
                    console.log('Haulers below maximum [' + this.haulers.length + '/' + config.MAX_HAULERS + '] but there is not enough energy availible. [' + Game.spawns['Spawn1'].room.energyAvailable + ']');
                }
            }
            else if(this.upgraders.length < config.MAX_UPGRADERS )
            {
                if( Game.spawns['Spawn1'].room.energyAvailable >= config.getBuildCost(config.UPGRADE) )
                {
                    var newName = 'Upgrader' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(config.getBuild(config.UPGRADER_BUILD), newName, {memory: {role: 'upgrader'}});
                }
                else
                {
                    console.log('Upgraders below maximum [' + this.upgraders.length + '/' +config.MAX_UPGRADERS + '] but there is not enough energy availible. [' + Game.spawns['Spawn1'].room.energyAvailable + ']');
                }
            }
            else if(this.claimers.length < config.MAX_CLAIMERS )
            {
                if( Game.spawns['Spawn1'].room.energyAvailable >= config.getBuildCost(config.CLAIMER_BUILD) )
                {
                    var newName = 'Claimer' + Game.time;
                    console.log('Spawning new claimer: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(config.getBuild(config.CLAIMER_BUILD), newName, {memory: {role: 'claimer', targetFlag: 'Capture'}});
                }
                else
                {
                    console.log('Claimers below maximum [' + this.claimers.length + '/' +config.MAX_CLAIMERS + '] but there is not enough energy availible. [' + Game.spawns['Spawn1'].room.energyAvailable + ']');
                }
            }
            else if(this.builders.length < config.MAX_BUILDERS )
            {
                // Only build new builders if we can find construction sites.
                var targets = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES)
                
                
                if( targets.length  || IGNORE_CON_REQ == true )
                {
                    if( Game.spawns['Spawn1'].room.energyAvailable >= config.getBuildCost(config.BUILDER_BUILD) )
                    {
                        var newName = 'Builder' + Game.time;
                        console.log('Construction sites availible, spawning new builders: ' + newName);
                        Game.spawns['Spawn1'].spawnCreep(config.getBuild(config.BUILDER_BUILD), newName, {memory: {role: 'builder'}});
                    }
                    else
                    {
                        console.log('Builders below maximum [' + this.builders.length + '/' + config.MAX_BUILDERS + '] but there is not enough energy availible. [' + Game.spawns['Spawn1'].room.energyAvailable + ']');
                    }
                }
                else
                {
                    console.log('Builders below maximum [' + this.builders.length + '/' + config.MAX_BUILDERS + '] but there are no construction sites around to make it worth it.');
                }
            }
        }
    }

    handleRoles() {
        for(var name in this.allCreeps)
        {
            var creep = this.allCreeps[name];
            var ctrl = new MinionController(creep);

            ctrl.update();            
        }
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
};

module.exports = CreepManager;