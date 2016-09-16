import PIXI from 'pixi.js';
import Maths from './Maths';

import {RoleIdle, RoleBuilder, RoleCollectWood, RoleCollectStone} from './DwarfRoles';

export default function Dwarf(world, startX, startY, roleId) {

    PIXI.Container.call(this);

    this.target = null;

    this.id = Dwarf.ID ++;

    this.angle = 0;

    this.timeSinceAction = 0;
    this.timeBetweenActions = 2000;

    this.roleId = null;
    this.careerRole = Dwarf.ROLES[roleId];

    this.changeRole(this.careerRole.id);

    let base = new PIXI.Graphics();
    base.beginFill(0x333333);
    base.drawRect(0, 0, Dwarf.WIDTH, Dwarf.HEIGHT);
    base.endFill();

    base.x = - Dwarf.WIDTH * .5;
    base.y = - Dwarf.HEIGHT;

    this.addChild(base)

    this.x = this.startX = startX;
    this.y = this.startY = startY;

}

Dwarf.constructor = Dwarf;
Dwarf.prototype = Object.create(PIXI.Container.prototype);

Dwarf.prototype.changeRole = function(roleId) {

    console.log('Dwarf.changeRole(', this.id, this.roleId, '>', roleId, ')');

    this.role = Dwarf.ROLES[roleId];
    this.roleId = roleId;

}

Dwarf.prototype.canTakeAction = function() {

    return this.timeSinceAction > this.timeBetweenActions;

}

Dwarf.prototype.tookAction = function() {

    this.timeSinceAction = 0;

}

Dwarf.prototype.update = function(timeDelta, world) {

    this.timeSinceAction += timeDelta;

    let newRoleId = this.role.update(timeDelta, this, world) || false;

    if (newRoleId) {

        this.changeRole(newRoleId);

    }

    if (this.roleId === Dwarf.ROLE_IDLE) {

        this.careerRole.checkCanPerform(timeDelta, this, world);

    }

    if (this.target) {

        this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

        let distance = Maths.distanceBetween(this, this.target);

        let range = this.role.range || 5;

        if (distance < range && this.role.targetProximity) {

            this.role.targetProximity(timeDelta, this, world);

        } else {

            this.x += Math.cos(this.angle) * Dwarf.SPEED;
            this.y += Math.sin(this.angle) * Dwarf.SPEED;

        }

    }

}

Dwarf.ID = 0;

Dwarf.WIDTH = 8;
Dwarf.HEIGHT = 12;

Dwarf.SPEED = .75;

Dwarf.ROLE_IDLE = 'idle';
Dwarf.ROLE_BUILDER = 'builder';
Dwarf.ROLE_COLLECT_WOOD = 'collect-wood';
Dwarf.ROLE_COLLECT_STONE = 'collect-stone';

Dwarf.ROLES = {
    'idle': RoleIdle,
    'builder': RoleBuilder,
    'collect-wood': RoleCollectWood,
    'collect-stone': RoleCollectStone
};
