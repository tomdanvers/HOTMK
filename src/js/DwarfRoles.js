import Maths from './utils/Maths';
import Dwarf from './Dwarf';
import Tree from './Tree';
import Rock from './Rock';

export default function DwarfRoles() {

    this.rolesMap = {
        'idle': RoleIdle,
        'resting': RoleResting,
        'builder': RoleBuilder,
        'collect-wood': RoleCollectWood,
        'collect-stone': RoleCollectStone,
        'watch-night': RoleWatchNight
    };

    // console.log('DwarfRoles(',this.rolesMap,')');

}

DwarfRoles.constructor = DwarfRoles;

DwarfRoles.prototype.getById = function(id) {

    return this.rolesMap[id];

}

DwarfRoles.IDLE = 'idle';
DwarfRoles.RESTING = 'resting';
DwarfRoles.BUILDER = 'builder';
DwarfRoles.COLLECT_WOOD = 'collect-wood';
DwarfRoles.COLLECT_STONE = 'collect-stone';
DwarfRoles.WATCH_NIGHT = 'watch-night';

export const RoleIdle = {

    id: 'idle',

    update(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            if (Math.random() > .75) {

                dwarf.target = {
                    x: dwarf.startX + Math.random() * 60 - 30,
                    y: dwarf.startY + Math.random() * 60 - 30
                };

            }

            dwarf.tookAction();

        }

        if (dwarf.careerRole.checkCanPerform(timeDelta, dwarf, world)) {

            return dwarf.careerRole.id;

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        dwarf.target = false;

    }

}

export const RoleResting = {

    id: 'resting',

    range: 2,

    enter(dwarf, world) {

        if (dwarf.home) {

            dwarf.target = dwarf.home;

        }

    },

    update(timeDelta, dwarf, world) {

        if (dwarf.careerRole.startTime && dwarf.careerRole.endTime && world.timeOfDay.isDuringPeriod(dwarf.careerRole.startTime, dwarf.careerRole.endTime)){

            return dwarf.careerRole.id;

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        dwarf.target = false;

    }

}

export const RoleWatchNight = {

    id: 'watch-night',

    startTime: 19,
    endTime: 7,

    range: 10,

    colour: 0x553333,

    cWood: 50,
    cStone: 50,

    enter(dwarf, world) {

        if (dwarf.home) {

            dwarf.target = dwarf.home;

        }

    },

    updateRoute(dwarf, world) {

        let watchTower = dwarf.home;

        if (watchTower.patrolRoute.length > 0) {

            dwarf.patrolRouteIndex = Math.floor(Math.random() * watchTower.patrolRoute.length);
            dwarf.target = watchTower.patrolRoute[dwarf.patrolRouteIndex].building;

            dwarf.patrolRouteVersion = watchTower.patrolRoute.version;

        } else {

            dwarf.patrolRouteVersion = 1;

            dwarf.target = watchTower;

        }

    },

    update(timeDelta, dwarf, world) {

        if (dwarf.patrolRouteVersion !== dwarf.home.patrolRoute.version) {

            this.updateRoute(dwarf, world);

        }


    },

    targetProximity(timeDelta, dwarf, world) {


        if (dwarf.canTakeAction()) {

            let watchTower = dwarf.home;

            // console.log('RoleWatchNight.targetProximity(', watchTower, ')');

            if (watchTower.patrolRoute && watchTower.patrolRoute.length > 0) {

                let nextWaypointIndex = dwarf.patrolRouteIndex + 1;

                if (nextWaypointIndex >= watchTower.patrolRoute.length) {
                    nextWaypointIndex = 0;
                }

                dwarf.patrolRouteIndex = nextWaypointIndex;

                let nextWaypoint = watchTower.patrolRoute[dwarf.patrolRouteIndex];

                dwarf.target = {
                    x: nextWaypoint.building.x + Math.random() * 40 - 20,
                    y: nextWaypoint.building.y + Math.random() * 40 - 20
                };

            } else {

                dwarf.target = {
                    x: watchTower.x + Math.random() * 80 - 40,
                    y: watchTower.y + Math.random() * 80 - 40
                };

            }

            dwarf.tookAction();

        }

    }

}

export const RoleBuilder = {

    id: 'builder',

    startTime: 5.5,
    endTime: 20,

    range: 10,

    colour: 0x333355,

    cWood: 50,
    cStone: 50,

    checkCanPerform(timeDelta, dwarf, world) {

        if (Utils.nearestWithoutProperty('integrity', dwarf, world.buildings.buildings)) {

            dwarf.changeRole(dwarf.careerRole.id);

        }

    },

    update(timeDelta, dwarf, world) {

        if ( !dwarf.target || dwarf.target.type !== 'building' ) {

            let target = Utils.nearestWithoutProperty('integrity', dwarf, world.buildings.buildings) || false;

            if (target) {

                dwarf.target = target;

            } else {

                dwarf.startX = dwarf.x;
                dwarf.startY = dwarf.y;

                return DwarfRoles.IDLE;

            }

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            let building = dwarf.target;

            if (!building.integrity.isMax()) {

                let rate = Math.min(10, building.integrity.getRemainder());

                building.integrity.increment(rate);

                if (building.integrity.isMax() && !building.isConstructed) {

                    building.constructed();

                }

                dwarf.tookAction();

            } else {

                dwarf.target = false;

            }

        }

    }

}

export const RoleCollectWood = {

    id: 'collect-wood',

    startTime: 5.5,
    endTime: 20,

    colour: 0x335533,

    cWood: 20,
    cStone: 40,

    checkCanPerform(timeDelta, dwarf, world) {

        if (Utils.nearestWithProperty('supply', dwarf, world.trees)) {

            dwarf.changeRole(dwarf.careerRole.id);

        }

    },

    update(timeDelta, dwarf, world) {

        // Check inventory

        if (dwarf.inventory.isFull()) {

            if ( !dwarf.target || dwarf.target !== dwarf.home ) {

                dwarf.target = dwarf.home;

            }

        } else {

            if ( !dwarf.target || dwarf.target.type !== Tree.TYPE ) {

                let target = Utils.nearestWithProperty('supply', dwarf, world.trees) || false;

                if (target) {

                    dwarf.target = target;

                } else {

                    return DwarfRoles.IDLE;

                }

            }

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            if (dwarf.inventory.isFull()) {

                // Next to house so offload supply

                world.supply.wood.increment(dwarf.inventory.remove('wood'));

                dwarf.target = false;

            } else {

                // Next to tree so add supply to inventory

                let tree = dwarf.target;

                if (!tree.supply.isMin()) {

                    let rate = Math.min(1, tree.supply.get(), dwarf.inventory.free());

                    tree.supply.decrement(rate);

                    dwarf.inventory.add('wood', rate);

                    //world.supply.wood.increment(rate);

                    tree.hit();

                    dwarf.tookAction();

                } else {

                    dwarf.target = false;

                }

            }

        }

    }

}

export const RoleCollectStone = {

    id: 'collect-stone',

    startTime: 5.5,
    endTime: 20,

    colour: 0x444444,

    cWood: 40,
    cStone: 20,

    checkCanPerform(timeDelta, dwarf, world) {

        if (Utils.nearestWithProperty('supply', dwarf, world.rocks)) {

            dwarf.changeRole(dwarf.careerRole.id);

        }

    },

    update(timeDelta, dwarf, world) {

        if (dwarf.inventory.isFull()) {

            if ( !dwarf.target || dwarf.target !== dwarf.home ) {

                dwarf.target = dwarf.home;

            }

        } else {

            if ( !dwarf.target || dwarf.target.type !== Rock.TYPE ) {

                let target = Utils.nearestWithProperty('supply', dwarf, world.rocks) || false;

                if (target) {

                    dwarf.target = target;

                } else {

                    return DwarfRoles.IDLE;

                }

            }

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            if (dwarf.inventory.isFull()) {

                // Next to house so offload supply

                world.supply.stone.increment(dwarf.inventory.remove('stone'));

                dwarf.target = false;

            } else {

                // Next to rock so add supply to inventory

                let rock = dwarf.target;

                if (!rock.supply.isMin()) {

                    let rate = Math.min(1, rock.supply.get(), dwarf.inventory.free());

                    rock.supply.decrement(rate);

                    dwarf.inventory.add('stone', rate);

                    rock.hit();

                    dwarf.tookAction();

                } else {

                    dwarf.target = false;

                }

            }

        }


    }

}

const Utils = {

    nearestWithProperty(property, referencePoint, items) {

        let distanceToClosest = Number.MAX_VALUE;
        let closest = false;

        items.forEach(function(item) {

            if (!item[property].isMin()) {

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

            if (!item[property].isMax()) {

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
