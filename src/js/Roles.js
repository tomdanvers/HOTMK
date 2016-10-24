import Maths from './utils/Maths';
import Dwarf from './Dwarf';
import Tree from './Tree';
import Rock from './Rock';

export default class Roles {

    constructor() {

        this.rolesMap = {
            'idle': new RoleIdle(),
            'resting': new RoleResting(),
            'builder': new RoleBuilder(),
            'hunter': new RoleHunter(),
            'soldier': new RoleSoldier(),
            'collect-wood': new RoleCollectWood(),
            'collect-stone': new RoleCollectStone(),
            'watch-day': new RoleWatchDay(),
            'watch-night': new RoleWatchNight(),
            'healer': new RoleHealer(),
            'flee': new RoleFlee(),
            'self-defense': new RoleSelfDefense(),
            'predator': new RolePredator(),
            'prey': new RolePrey()
        };

    }

    getById(id) {

        return this.rolesMap[id];

    }

}


Roles.IDLE = 'idle';
Roles.RESTING = 'resting';
Roles.BUILDER = 'builder';
Roles.HUNTER = 'hunter';
Roles.SOLDIER = 'soldier';
Roles.COLLECT_WOOD = 'collect-wood';
Roles.COLLECT_STONE = 'collect-stone';
Roles.HEALER = 'healer';
Roles.WATCH_DAY = 'watch-day';
Roles.WATCH_NIGHT = 'watch-night';
Roles.FLEE = 'flee';
Roles.SELF_DEFENSE = 'self-defense';

Roles.PREY = 'prey';
Roles.PREDATOR = 'predator';



/* --------------------------------- */
/* ---------------------------- IDLE */
/* --------------------------------- */

class RoleIdle {

    constructor() {

        this.id = 'idle';

    }

    update(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (Math.random() > .75) {

                let idleRange = entity.archetype.rangeIdle || 30;
                let a = Math.random() * Math.PI * 2;

                entity.target = {
                    x: entity.startX + Math.cos(a) * idleRange,
                    y: entity.startY + Math.sin(a) * idleRange
                };

            }

            entity.tookAction();

        }

        if (entity.careerRole.checkCanPerform(timeDelta, entity, world)) {

            return entity.careerRole.id;

        }

    }

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}




/* --------------------------------- */
/* ---------------------------- FLEE */
/* --------------------------------- */

class RoleFlee {

    constructor() {

        this.id = 'flee';

    }

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    }

    update(timeDelta, entity, world) {

        // What to do when I get home?

        // If no enemies nearby then return to idle...

        if (!entity.target) {

            return Roles.IDLE;

        }

    }

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}




/* --------------------------------- */
/* -------------------- SELF DEFENSE */
/* --------------------------------- */

class RoleSelfDefense {

    constructor() {

        this.id = 'self-defense';

        this.isWeaponBased = true;

    }

    update(timeDelta, entity, world) {

        if (!entity.target || !entity.target.isAlive()) {

            entity.target = false;

            return Roles.IDLE;

        }

    }

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


/* --------------------------------- */
/* ------------------------- RESTING */
/* --------------------------------- */

class RoleResting {

    constructor() {

        this.id = 'resting';

    }

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    }

    exit(entity, world) {

        entity.visible = true;

    }

    update(timeDelta, entity, world) {

        if (entity.careerRole.startTime && entity.careerRole.endTime && world.timeOfDay.isDuringPeriod(entity.careerRole.startTime + entity.offsetStartTime, entity.careerRole.endTime + entity.offsetEndTime)){

            return entity.careerRole.id;

        }

    }

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

        entity.visible = false;

    }

}



/* --------------------------------- */
/* --------------------------- WATCH */
/* --------------------------------- */

class RoleWatch {

    constructor() {

        this.id = 'watch';

    }

    checkCanPerform(timeDelta, entity, world) {

        return true;

    }

    enter(entity, world) {

        if (entity.home) {

            entity.target = entity.home;

        }

    }

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

    }

    update(timeDelta, entity, world) {

        if (entity.patrolRouteVersion !== entity.home.patrolRoute.version) {

            this.updateRoute(entity, world);

        }

        let targets = Utils.percievedEntities(entity, world.motherNature.animals);

        if (targets.length > 0) {

            entity.target = targets[0];

            return Roles.PREDATOR;

        }

    }

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




/* --------------------------------- */
/* --------------------- WATCH NIGHT */
/* --------------------------------- */

class RoleWatchNight extends RoleWatch {

    constructor() {

        super();

        this.id = 'watch-night';

        this.startTime = 19;
        this.endTime = 7;

    }


}


/* --------------------------------- */
/* ----------------------- WATCH DAY */
/* --------------------------------- */

class RoleWatchDay extends RoleWatch {

    constructor() {

        super();

        this.id = 'watch-day';

        this.startTime = 7;
        this.endTime = 18;

    }

}


/* --------------------------------- */
/* -------------------------- HEALER */
/* --------------------------------- */

class RoleHealer {

    constructor() {

        this.id = 'healer';

        this.startTime = 5.5;
        this.endTime = 20;

    }

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithoutProperty('health', entity, world.dwarves);

    }

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

    }

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



/* --------------------------------- */
/* ------------------------- BUILDER */
/* --------------------------------- */

class RoleBuilder {

    constructor() {

        this.id = 'builder';

        this.startTime = 5.5;
        this.endTime = 20;

    }

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithoutProperty('integrity', entity, world.buildings.buildings);

    }

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

    }

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




/* --------------------------------- */
/* -------------------------- HUNTER */
/* --------------------------------- */

class RoleHunter {

    constructor() {

        this.id = 'hunter';

        this.startTime = 5;
        this.endTime = 19.5;

        this.isWeaponBased = true;

    }

    checkCanPerform(timeDelta, entity, world) {

        let target = Utils.nearestWithProperty('health', entity, world.motherNature.animals);

        return (target && Maths.distanceBetween(entity, target) <= entity.rangePerception && Maths.distanceBetween(entity, entity.home) <= entity.rangeLimit);

    }

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

    }

    targetProximity(timeDelta, entity, world) {

        if (entity.target && entity.target.isAlive !== undefined && entity.target.isAlive()) {

            if (entity.canTakeAction()) {

                // Attack

                let animal = entity.target;

                animal.takeDamage(entity.weapon.damage, entity);

                entity.tookAction();

                if (!animal.isAlive()) {

                    world.ui.log.log('Dwarf "' + entity.name + '" killed "' + animal.name + '" with "' + entity.weapon.title + '"');

                    entity.target = false;

                    return Roles.IDLE;

                }

            }

        } else {

            entity.target = false;

        }

    }

}


/* --------------------------------- */
/* ------------------------- SOLDIER */
/* --------------------------------- */

class RoleSoldier {

    constructor() {

        this.id = 'soldier';

        this.startTime = 5.5;
        this.endTime = 20.5;

        this.isWeaponBased = true;

    }

    checkCanPerform(timeDelta, entity, world) {

        let targets = Utils.percievedEntities(entity, world.motherNature.animals);

        if (targets.length > 0) {

            entity.target = targets.random();

            return true;

        } else {

            return false;

        }


    }

    update(timeDelta, entity, world) {

        if (entity.target) {

            if (!entity.target.isAlive()) {

                entity.target = false;

                return Roles.IDLE;

            }


        } else {

            return Roles.IDLE;

        }

    }

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            // Attack

            let target = entity.target;

            target.takeDamage(entity.weapon.damage, entity);

            entity.tookAction();

            if (!target.isAlive()) {

                world.ui.log.log('"' + entity.name + '" killed "' + target.name + '" with "' + entity.weapon.title + '"');

                entity.target = false;

                return Roles.IDLE;

            }

        }

    }

}


/* --------------------------------- */
/* -------------------- COLLECT WOOD */
/* --------------------------------- */

class RoleCollectWood {

    constructor() {

        this.id = 'collect-wood';

        this.startTime = 5.5;
        this.endTime = 20;

    }

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithProperty('supply', entity, world.trees);

    }

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

    }

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (entity.target === entity.home) {

                // Next to house so offload supply

                world.supply.wood.increment(entity.inventory.remove('wood'));

                entity.target = false;

            } else if (entity.target.type === Tree.TYPE) {

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



/* --------------------------------- */
/* ------------------- COLLECT STONE */
/* --------------------------------- */

class RoleCollectStone {

    constructor() {

        this.id = 'collect-stone';

        this.startTime = 5.5;
        this.endTime = 20;

    }

    checkCanPerform(timeDelta, entity, world) {

        return Utils.nearestWithProperty('supply', entity, world.rocks);

    }

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

    }

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            if (entity.target === entity.home) {

                // Next to house so offload supply

                world.supply.stone.increment(entity.inventory.remove('stone'));

                entity.target = false;

            } else if (entity.target.type === Rock.TYPE) {

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



/* --------------------------------- */
/* ------------------------ PREDATOR */
/* --------------------------------- */

class RolePredator {

    constructor() {

        this.id = 'predator';

        this.isWeaponBased = true;

    }

    checkCanPerform(timeDelta, entity, world) {

        let targets = Utils.percievedEntities(entity, world.dwarves);

        if (targets.length > 0) {

            entity.target = targets.random();

            return true;

        } else {

            return false;

        }


    }

    update(timeDelta, entity, world) {

        if (entity.target) {

            if (!entity.target.isAlive()) {

                entity.target = false;

                return Roles.IDLE;

            }


        } else {

            return Roles.IDLE;

        }

    }

    targetProximity(timeDelta, entity, world) {

        if (entity.canTakeAction()) {

            // Attack

            let target = entity.target;

            target.takeDamage(entity.weapon.damage, entity);

            entity.tookAction();

            if (!target.isAlive()) {

                world.ui.log.log('"' + entity.name + '" killed "' + target.name + '" with "' + entity.weapon.title + '"');

                entity.target = false;

                return Roles.IDLE;

            }

        }

    }

}



/* --------------------------------- */
/* ---------------------------- PREY */
/* --------------------------------- */

class RolePrey {

    constructor() {

        this.id = 'prey';

    }

    checkCanPerform(timeDelta, entity, world) {

        return Utils.percievedEntities(entity, world.dwarves).length > 0;

    }

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

    }

    targetProximity(timeDelta, entity, world) {

        entity.target = false;

    }

}


/* --------------------------------- */
/* --------------------------- UTILS */
/* --------------------------------- */

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
