module.exports.DEFAULT_BUILD        = 0;
module.exports.HARVESTER_BUILD      = 1;
module.exports.HAULER_BUILD         = 2;
module.exports.BUILDER_BUILD        = 3;
module.exports.UPGRADER_BUILD       = 4;
module.exports.CLAIMER_BUILD        = 5;
module.exports.ATTACKER_BUILD       = 6;

module.exports.MAX_HARVESTERS       = 5;
module.exports.MAX_HAULERS          = 5;
module.exports.MAX_BUILDERS         = 5;
module.exports.MAX_UPGRADERS        = 0;
module.exports.MAX_ATTACKERS        = 0;
module.exports.MAX_CLAIMERS         = 0;

module.exports.HARVESTER_SOURCE     = 1;
module.exports.HAULER_SOURCE        = 0
module.exports.BUILDER_SOURCE       = 1;
module.exports.UPGRADER_SOURCE      = 0;

module.exports.MOVE_FROM_CONTAINERS = true;

module.exports.getBuild = function(level)
{
    var build = [WORK,MOVE,CARRY]; // Initial default.
    
    switch(level)
    {
        case 1: // Harvester Build
            build = [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
            break;
        case 2: // Hauler Build
            build = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            break;
        case 3: // Builder build
            build = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            break;
        case 4: // Upgrader build
            build = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            break;
        case 5: // Claimer Build
            build = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,CLAIM];
            break;
        case 6: // Attacker Build
            build = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            break;
        default:
            build = [WORK,MOVE,CARRY]
    }
        
    return build;
};

module.exports.getBuildCost = function(level)
{
    var cost = 0;
        
    switch(level)
    {
        case 1: cost = 400; break;
        case 2: cost = 400; break;
        case 3: cost = 400; break;
        case 4: cost = 400; break;
        case 5: cost = 800; break;
        case 6: cost = 800; break;
    }
        
    return cost;
};

module.exports.getTotalEnergyAvailable = function(room) {
    var energy = 0;

    var containers = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0; // Only target containers with energy
        }
    });
    
    var targets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION) &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });

    for( let i = 0; i < containers.length; i++) {
        energy += containers[i].store[RESOURCE_ENERGY];
    }

    for( let i = 0; i < targets.length; i++) {
        energy += targets[i].store[RESOURCE_ENERGY];
    }

    return energy;
};