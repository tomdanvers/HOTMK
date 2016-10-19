import Maths from './utils/Maths';
import Dwarf from './Dwarf';
import Tree from './Tree';
import Rock from './Rock';

export default function Roles() {

    this.rolesMap = {
        'idle': RoleIdle,
        'resting': RoleResting,
        'builder': RoleBuilder,
        'hunter': RoleHunter,
        'collect-wood': RoleCollectWood,
        'collect-stone': RoleCollectStone,
        'watch-night': RoleWatchNight,
        'healer': RoleHealer,
        'flee': RoleFlee,
        'self-defense': RoleSelfDefense,
        'predator': RolePredator,
        'prey': RolePrey
    };

    // console.log('Roles(',this.rolesMap,')');

}

Roles.constructor = Roles;

Roles.prototype.getById = function(id) {

    return this.rolesMap[id];

}

Roles.IDLE = 'idle';
Roles.RESTING = 'resting';
Roles.BUILDER = 'builder';
Roles.HUNTER = 'hunter';
Roles.COLLECT_WOOD = 'collect-wood';
Roles.COLLECT_STONE = 'collect-stone';
Roles.HEALER = 'healer';
Roles.WATCH_NIGHT = 'watch-night';
Roles.FLEE = 'flee';
Roles.SELF_DEFENSE = 'self-defense';

Roles.PREY = 'prey';
Roles.PREDATOR = 'predator';

export const RoleIdle = {

    id: 'idle',

    update(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (Math.random() > .75) {

                entity.target = {
                    x: entity.startX + Math.random() * 60 - 30,
                    y: entity.startY + Math.random() * 60 - 30
                };

            }

            entity.tookAction();

        }

        if (entity.careerRole.checkCanPerform(timeDelta, entity, world)) {

            return entity.careerRole.id;

        }

    },

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}

export const RoleFlee = {

    id: 'flee',

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    },

    update(timeDelta, entity, world) {

        // What to do when I get home?

        // If no enemies nearby then return to idle...

        if (!entity.target) {

            return Roles.IDLE;

        }

    },

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}

export const RoleSelfDefense = {

    id: 'self-defense',

    isWeaponBased: true,

    update(timeDelta, entity, world) {

        if (!entity.target || !entity.target.isAlive()) {

            entity.target = false;

            return Roles.IDLE;

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.target && entity.target.isAlive && entity.target.isAlive()) {

            if (entity.canTakeAction()) {

                // Attack

                let target = entity.target;

                target.takeDamage(entity.weapon.damage, entity);

                entity.tookAction();

                if (!target.isAlive()) {

                    world.ui.log.log('"' + entity.name + '" killed "' + target.name + '"');

                    entity.target = false;

                    return Roles.IDLE;

                }

            }

        }

    }

}

export const RoleResting = {

    id: 'resting',

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    },

    update(timeDelta, entity, world) {

        if (entity.careerRole.startTime && entity.careerRole.endTime && world.timeOfDay.isDuringPeriod(entity.careerRole.startTime, entity.careerRole.endTime)){

            return entity.careerRole.id;

        }

    },

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}

export const RoleWatchNight = {

    id: 'watch-night',

    startTime: 19,
    endTime: 7,

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    },

    updateRoute(entity, world) {

        let watchTower = entity.home;

        if (watchTower.patrolRoute.length > 0) {

            entity.patrolRouteIndex = Math.floor(Math.random() * watchTower.patrolRoute.length);
            entity.target = watchTower.patrolRoute[entity.patrolRouteIndex].building;

            entity.patrolRouteVersion = watchTower.patrolRoute.version;

        } else {

            entity.patrolRouteVersion = 1;

            entity.target = watchTower;

        }

    },

    update(timeDelta, entity, world) {

        if (entity.patrolRouteVersion !== entity.home.patrolRoute.version) {

            this.updateRoute(entity, world);

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            let watchTower = entity.home;

            // console.log('RoleWatchNight.targetProximity(', watchTower, ')');

            if (watchTower.patrolRoute && watchTower.patrolRoute.length > 0) {

                let nextWaypointIndex = entity.patrolRouteIndex + 1;

                if (nextWaypointIndex >= watchTower.patrolRoute.length) {
                    nextWaypointIndex = 0;
                }

                entity.patrolRouteIndex = nextWaypointIndex;

                let nextWaypoint = watchTower.patrolRoute[entity.patrolRouteIndex];

                entity.target = {
                    x: nextWaypoint.building.x + Math.random() * 40 - 20,
                    y: nextWaypoint.building.y + Math.random() * 40 - 20
                };

            } else {

                entity.target = {
                    x: watchTower.x + Math.random() * 80 - 40,
                    y: watchTower.y + Math.random() * 80 - 40
                };

            }

            entity.tookAction();

        }

    }

}


export const RoleHealer = {

    id: 'healer',

    startTime: 5.5,
    endTime: 20,

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithoutProperty('health', entity, world.dwarves);

    },

    update(timeDelta, entity, world) {

        if ( !entity.target || entity.target.type !== 'dwarf' || !entity.target.isAlive()) {

            let target = Utils.nearestWithoutProperty('health', entity, world.dwarves) || false;

            if (target) {

                entity.target = target;

            } else {

                entity.startX = entity.x;
                entity.startY = entity.y;

                return Roles.IDLE;

            }

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            let entityB = entity.target;

            if (entityB.health.isMax() || entityB.health.isMin()) {

                entity.target = false;

            } else {

                let rate = Math.min(3, entityB.health.getRemainder());

                entityB.takeHealing(rate);

                entity.tookAction();

            }

        }

    }

}



export const RoleBuilder = {

    id: 'builder',

    startTime: 5.5,
    endTime: 20,

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithoutProperty('integrity', entity, world.buildings.buildings);

    },

    update(timeDelta, entity, world) {

        if ( !entity.target || entity.target.type !== 'building' ) {

            let target = Utils.nearestWithoutProperty('integrity', entity, world.buildings.buildings) || false;

            if (target) {

                entity.target = target;

            } else {

                entity.startX = entity.x;
                entity.startY = entity.y;

                return Roles.IDLE;

            }

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            let building = entity.target;

            if (!building.integrity.isMax()) {

                let rate = Math.min(10, building.integrity.getRemainder());

                building.integrity.increment(rate);

                if (building.integrity.isMax() && !building.isConstructed) {

                    building.constructed();

                }

                entity.tookAction();

            } else {

                entity.target = false;

            }

        }

    }

}

export const RoleHunter = {

    id: 'hunter',

    startTime: 5,
    endTime: 19.5,

    isWeaponBased: true,

    checkCanPerform(timeDelta, entity, world) {

        let target = Utils.nearestWithProperty('health', entity, world.motherNature.animals);

        return (target && Maths.distanceBetween(entity, target) <= entity.rangePerception && Maths.distanceBetween(entity, entity.home) <= entity.rangeLimit);

    },


    update(timeDelta, entity, world) {

        if (entity.target) {

            if (Maths.distanceBetween(entity, entity.home) > entity.rangeLimit) {

                // This critter got away...

                entity.target = false;

                return Roles.IDLE;

            }

        } else {

            let target = Utils.nearestWithProperty('health', entity, world.motherNature.animals);

            if (target && Maths.distanceBetween(entity, target) <= entity.rangePerception && Maths.distanceBetween(entity, entity.home) <= entity.rangeLimit) {

                entity.target = target;

            } else {

                return Roles.IDLE;

            }


        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.target && entity.target.isAlive !== undefined && entity.target.isAlive()) {

            if (entity.canTakeAction()) {

                // Attack

                let animal = entity.target;

                animal.takeDamage(entity.weapon.damage, entity);

                entity.tookAction();

                if (!animal.isAlive()) {

                    world.ui.log.log('Dwarf "' + entity.name + '" killed "' + animal.name + '"');

                    entity.target = false;
                    entity.range = this.range;

                    return Roles.IDLE;

                }

            }

        } else {

            entity.target = false;

        }


    }

}

export const RoleCollectWood = {

    id: 'collect-wood',

    startTime: 5.5,
    endTime: 20,

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithProperty('supply', entity, world.trees);

    },

    update(timeDelta, entity, world) {

        // Check inventory

        if (entity.inventory.isFull()) {

            if ( !entity.target || entity.target !== entity.home ) {

                entity.target = entity.home;

            }

        } else {

            if ( !entity.target || entity.target.type !== Tree.TYPE ) {

                let target = Utils.nearestWithProperty('supply', entity, world.trees) || false;

                if (target) {

                    entity.target = target;

                } else {

                    return Roles.IDLE;

                }

            }

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (entity.inventory.isFull()) {

                // Next to house so offload supply

                world.supply.wood.increment(entity.inventory.remove('wood'));

                entity.target = false;

            } else {

                // Next to tree so add supply to inventory

                let tree = entity.target;

                if (!tree.supply.isMin()) {

                    let rate = Math.min(1, tree.supply.get(), entity.inventory.free());

                    tree.supply.decrement(rate);

                    entity.inventory.add('wood', rate);

                    //world.supply.wood.increment(rate);

                    tree.hit();

                    entity.tookAction();

                } else {

                    entity.target = false;

                }

            }

        }

    }

}

export const RoleCollectStone = {

    id: 'collect-stone',

    startTime: 5.5,
    endTime: 20,

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithProperty('supply', entity, world.rocks);

    },

    update(timeDelta, entity, world) {

        if (entity.inventory.isFull()) {

            if ( !entity.target || entity.target !== entity.home ) {

                entity.target = entity.home;

            }

        } else {

            if ( !entity.target || entity.target.type !== Rock.TYPE ) {

                let target = Utils.nearestWithProperty('supply', entity, world.rocks) || false;

                if (target) {

                    entity.target = target;

                } else {

                    return Roles.IDLE;

                }

            }

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (entity.inventory.isFull()) {

                // Next to house so offload supply

                world.supply.stone.increment(entity.inventory.remove('stone'));

                entity.target = false;

            } else {

                // Next to rock so add supply to inventory

                let rock = entity.target;

                if (!rock.supply.isMin()) {

                    let rate = Math.min(1, rock.supply.get(), entity.inventory.free());

                    rock.supply.decrement(rate);

                    entity.inventory.add('stone', rate);

                    rock.hit();

                    entity.tookAction();

                } else {

                    entity.target = false;

                }

            }

        }


    }

}

export const RolePredator = {

    id: 'predator',

    isWeaponBased: true,

    checkCanPerform(timeDelta, entity, world) {

        let targets = Utils.percievedEntities(entity, world.dwarves);

        if (targets.length > 0) {

            entity.target = targets.random();

            return true;

        } else {

            return false;

        }


    },

    update(timeDelta, entity, world) {

        if (entity.target) {

            if (!entity.target.isAlive()) {

                entity.target = false;

                return Roles.IDLE;

            }


        } else {

            return Roles.IDLE;

        }

    },

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            // Attack

            let target = entity.target;

            target.takeDamage(entity.weapon.damage, entity);

            entity.tookAction();

            if (!target.isAlive()) {

                world.ui.log.log('"' + entity.name + '" killed "' + target.name + '"');

                entity.target = false;

                return Roles.IDLE;

            }

        }

    }

}

export const RolePrey = {

    id: 'prey',

    checkCanPerform(timeDelta, entity, world) {

        return Utils.percievedEntities(entity, world.dwarves).length > 0;

    },

    update(timeDelta, entity, world) {

        if (world.timeOfDay.count % 10 === 0) {

            let percievedEntities = Utils.percievedEntities(entity, world.dwarves);

            if (percievedEntities.length > 0) {

                let fleeVectorX = 0;
                let fleeVectorY = 0;

                percievedEntities.forEach(function(entityB) {

                    fleeVectorX += (entity.x - entityB.x);
                    fleeVectorY += (entity.y - entityB.y);

                }.bind(this));

                let fleeAngle = Math.atan2(fleeVectorY, fleeVectorX);

                entity.target = {
                    x: entity.x + Math.cos(fleeAngle) * 150,
                    y: entity.y + Math.sin(fleeAngle) * 150
                };

            }

        }

        if (!entity.target) {

            return Roles.IDLE;

        }

    },

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}

const Utils = {

    percievedEntities(entityA, entities){

        let distance;
        let percievedEntities = [];

        entities.forEach(function(entityB) {

            if (entityB.isAlive()) {

                distance = Maths.distanceBetween(entityA, entityB);

                if (Math.random() > entityB.stealthiness && distance < entityA.rangePerception) {

                    percievedEntities.push(entityB);

                }

            }

        }.bind(this));

        return percievedEntities;

    },

    nearestWithProperty(property, referencePoint, items) {

        let distanceToClosest = Number.MAX_VALUE;
        let closest = false;

        items.forEach(function(item) {

            let valid = item.isAlive !== undefined && !item.isAlive() ? false : !item[property].isMin();

            if (valid) {

                let distance = Maths.distanceBetween(referencePoint, item);

                if (distance < distanceToClosest) {
                    distanceToClosest = distance;
                    closest = item;
                }

            }

        }.bind(this));

        return closest;

    },

    nearestWithoutProperty(property, referencePoint, items) {

        let distanceToClosest = Number.MAX_VALUE;
        let closest = false;

        items.forEach(function(item) {

            let valid = item.isAlive !== undefined && !item.isAlive() ? false : !item[property].isMax();

            if (valid) {

                let distance = Maths.distanceBetween(referencePoint, item);

                if (distance < distanceToClosest) {
                    distanceToClosest = distance;
                    closest = item;
                }

            }

        }.bind(this));

        return closest;

    }

}
