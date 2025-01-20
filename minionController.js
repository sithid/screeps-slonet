var config = require('config');

class MinionController {
    constructor(creep) {
        this.creep = creep;
        this.creep.role = this.creep.memory.role;
    }

    update() {
        this.creep.role = this.creep.memory.role;
        this.creep.say(this.creep.role);
        
        this.updateTask();
    }

    updateTask() {
        switch( this.creep.role )
        {
            case 'harvester':
                this.runHarvest();
                break;
            case 'hauler': 
                this.runHauler();
                break;
            case 'builder':
                this.runBuild();
                break;
            case 'upgrader':
                this.runUpgrade();
                break;
            case 'claimer':
                this.runClaim()();
                break;
        }
    }

    runHarvest() {
        var creep = this.creep;

        if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0 )
            creep.memory.harvesting = false;

        
        if( !creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0 )
            creep.memory.harvesting = true;
        
        if( creep.memory.harvesting ) {
            var sources = creep.room.find(FIND_SOURCES);
            
            if(creep.harvest(sources[config.HARVESTER_SOURCE]) == ERR_NOT_IN_RANGE)
                creep.moveTo(sources[config.HARVESTER_SOURCE], {visualizePathStyle: {stroke: '#0000FF'}});
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, { 
                filter: (structure) => {
                    return (( structure.structureType == STRUCTURE_SPAWN) &&
                              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) || 
                           (( structure.structureType == STRUCTURE_EXTENSION  ) && 
                              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0); 
                }   
            });
            
            if(targets.length > 0)
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00FF00'}});
            }
            else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
            }
        }
    }

    // Desparately in need of refectorying.  Will revisit a cleaner implementation of role handling at a later time.
    runHauler() {
        var creep = this.creep;

        if( creep.memory.harvesting && creep.store.getFreeCapacity() == 0 )
            creep.memory.harvesting = false;

        if( !creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0 )
            creep.memory.harvesting = true;
        
        if( creep.memory.harvesting ) {
            var sources = creep.room.find(FIND_SOURCES);
            
            if(creep.harvest(sources[config.HAULER_SOURCE]) == ERR_NOT_IN_RANGE)
                creep.moveTo(sources[config.HAULER_SOURCE], {visualizePathStyle: {stroke: '#0000FF'}});
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity > 0;
                }
            });
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity > 0;
                }
            });

            if (containers.length > 0 && targets.length > 0) {
                let container = containers[0];
                let target = targets[0];

                if( creep.store.getFreeCapacity > 0 ) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#00FF00'}});
                    }
                }
                else {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00FF00'}});
                    }
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, { 
                    filter: (structure) => {
                        return  (( structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY ) > 0 ) || 
                                (( structure.structureType == STRUCTURE_EXTENSION  ) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY ) > 0 ) ||
                                (( structure.structureType == STRUCTURE_CONTAINER  ) && 
                                    structure.store.getFreeCapacity(STRUCTURE_CONTAINER ) > 0 ) ||
                                (( structure.structureType == STRUCTURE_STORAGE  ) && 
                                    structure.store.getFreeCapacity(STRUCTURE_STORAGE ) > 0 );            
                    }   
                });
            
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00FF00'}});
                }
                else {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
                }

                return;
            }
        }
    }

    runBuild() {
        var creep = this.creep;

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0)
            creep.memory.building = false;
        
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0)
            creep.memory.building = true;
            
        if(creep.memory.building) {
            var thisRoom = Game.spawns["Spawn1"].room;
            var sites = thisRoom.find(FIND_CONSTRUCTION_SITES);
            
            if(sites.length > 0 ) {
                if(creep.build(sites[0]) == ERR_NOT_IN_RANGE)
                    creep.moveTo(sites[0], {visualizePathStyle: {stroke: '#00FF00'}});
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
                
            if( sources.length ) {
                if(creep.harvest(sources[config.BUILDER_SOURCE]) == ERR_NOT_IN_RANGE) 
                    creep.moveTo(sources[config.BUILDER_SOURCE], {visualizePathStyle: {stroke: '#0000FF'}});
            }
        }
    }

    runUpgrade() {
        var creep = this.creep;
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0)
            creep.memory.upgrading = false;
            
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0)
            creep.memory.upgrading = true;
    
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
                
            if(creep.harvest(sources[config.UPGRADER_SOURCE]) == ERR_NOT_IN_RANGE)
                creep.moveTo(sources[config.UPGRADER_SOURCE], {visualizePathStyle: {stroke: '#0000FF'}});
        }
    }

    runClaim() {
        var creep = this.creep;
        
        let flag = Game.flags[creep.memory.targetFlag];

        let ctrl = creep.room.controller;

        if( flag ) {
            if(creep.room == flag.room) {
                let claimResult = creep.claimController(ctrl);

                if( claimResult == ERR_NOT_IN_RANGE)
                    creep.moveTo(ctrl, {visualizePathStyle: {stroke: '#00FF00'}});
            }
            else
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#00FF00'}});
        }
    }
}

module.exports = MinionController;