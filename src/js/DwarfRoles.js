import Maths from './Maths';
import Dwarf from './Dwarf';
import Tree from './Tree';
import Rock from './Rock';

export default function DwarfRoles() {

    this.rolesMap = {
        'idle': RoleIdle,
        'builder': RoleBuilder,
        'collect-wood': RoleCollectWood,
        'collect-stone': RoleCollectStone
    };

    // console.log('DwarfRoles(',this.rolesMap,')');

}

DwarfRoles.constructor = DwarfRoles;

DwarfRoles.prototype.getById = function(id) {

    console.log('DwarfRoles.getById(', id, this.rolesMap[id], ')');

    return this.rolesMap[id];

}

DwarfRoles.IDLE = 'idle';
DwarfRoles.BUILDER = 'builder';
DwarfRoles.COLLECT_WOOD = 'collect-wood';
DwarfRoles.COLLECT_STONE = 'collect-stone';

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

    },

    targetProximity(timeDelta, dwarf, world) {

        dwarf.target = false;

    }

}

export const RoleBuilder = {

    id: 'builder',

    range: 10,

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

            if (dwarf.target.integrity < dwarf.target.integrityMax) {

                let rate = Math.min(10, dwarf.target.integrityMax - dwarf.target.integrity);

                dwarf.target.integrity += rate;

                if (dwarf.target.integrity == dwarf.target.integrityMax && !dwarf.target.constructed) {

                    dwarf.target.constructed = true;

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

    cWood: 20,
    cStone: 40,

    checkCanPerform(timeDelta, dwarf, world) {

        if (Utils.nearestWithProperty('supply', dwarf, world.trees)) {

            dwarf.changeRole(dwarf.careerRole.id);

        }

    },

    update(timeDelta, dwarf, world) {

        if ( !dwarf.target || dwarf.target.type !== Tree.TYPE ) {

            let target = Utils.nearestWithProperty('supply', dwarf, world.trees) || false;

            if (target) {

                dwarf.target = target;

            } else {

                return DwarfRoles.IDLE;

            }

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            if (dwarf.target.supply > 0) {

                let rate = Math.min(10, dwarf.target.supply);

                dwarf.target.supply -= rate;

                world.supply.wood += rate;

                dwarf.target.hit();

                dwarf.tookAction();

            } else {

                dwarf.target = false;

            }

        }

    }

}

export const RoleCollectStone = {

    id: 'collect-stone',

    cWood: 40,
    cStone: 20,

    checkCanPerform(timeDelta, dwarf, world) {

        if (Utils.nearestWithProperty('supply', dwarf, world.rocks)) {

            dwarf.changeRole(dwarf.careerRole.id);

        }

    },

    update(timeDelta, dwarf, world) {

        if ( !dwarf.target || dwarf.target.type !== Rock.TYPE ) {

            let target = Utils.nearestWithProperty('supply', dwarf, world.rocks) || false;
            // let target = world.trees.random() || false;

            if (target) {

                dwarf.target = target;

            } else {

                return DwarfRoles.IDLE;

            }

        }

    },

    targetProximity(timeDelta, dwarf, world) {

        if (dwarf.canTakeAction()) {

            if (dwarf.target.supply > 0) {

                let rate = Math.min(5, dwarf.target.supply);

                dwarf.target.supply -= rate;

                world.supply.stone += rate;

                dwarf.target.hit();

                dwarf.tookAction();

            } else {

                dwarf.target = false;

            }

        }

    }

}

const Utils = {

    nearestWithProperty(property, referencePoint, items) {

        let distanceToClosest = Number.MAX_VALUE;
        let closest = false;

        items.forEach(function(item) {

            if (item[property] > 0) {

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

            if (item[property] < item[property + 'Max']) {

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
