const MinionController = require('./minionController');
const { Task, TaskManager } = require('./taskManager');

var config = require('config');

class CreepManager {
    constructor() {
        this.TaskManager = new TaskManager()
        this.updateCreeps();
    }
    
    updateCreeps() {
        this.updateLocalData();
        this.printBotNetData();
        this.manageRoles();
    }

    updateLocalData() {
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

    printBotNetData() {
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

    manageRoles() {
        for(var name in this.allCreeps)
        {
            var ctrl = new MinionController(this.allCreeps[name]);
            ctrl.update();            
        }
    }
}

module.exports = CreepManager;