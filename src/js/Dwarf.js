import PIXI from 'pixi.js';
import Maths from './utils/Maths';

import Creature from './Creature';

export default function Dwarf(world, startX, startY, archetype) {

    Creature.call(this, world, startX, startY, archetype);

    this.name = Dwarf.getName();

    this.light = this.world.lighting.addEmitter(this, this.careerRole.lightRadius || 30, 0, -10);

}

Dwarf.constructor = Dwarf;
Dwarf.prototype = Object.create(Creature.prototype);

Dwarf.prototype.getAppearance = function(roleId) {

    let base = new PIXI.Graphics();

    let heightFactor = .6;
    let headWidth = 2;
    let headHeight = 4;
    let colour = this.archetype.colour;

    // Body
    base.beginFill(colour);
    base.drawRect(0, 0, Dwarf.WIDTH, Dwarf.HEIGHT * heightFactor);
    base.endFill();

    // Head
    base.beginFill(colour);
    base.drawRect(Dwarf.WIDTH * .5 - headWidth * .5, -headHeight, headWidth, headHeight);
    base.endFill();

    // Left Leg
    base.beginFill(colour);
    base.drawRect(0, Dwarf.HEIGHT * heightFactor, 1, Dwarf.HEIGHT * (1-heightFactor));
    base.endFill();

    // Right Leg
    base.beginFill(colour);
    base.drawRect(Dwarf.WIDTH - 1, Dwarf.HEIGHT * heightFactor, 1, Dwarf.HEIGHT * (1-heightFactor));
    base.endFill();

    base.x = - Dwarf.WIDTH * .5;
    base.y = - Dwarf.HEIGHT;

    return base;

}

Dwarf.NAMES_FIRST = ['Snorri', 'Ori', 'Nori', 'Gloin', 'Oin', 'Bifur', 'Bofur', 'Thorin', 'Balin'];
Dwarf.NAMES_LAST = ['Oakenshield', 'Bittenaxe', 'Longbeard', 'Undermountain', 'Ironskull', 'Steelhammer'];

Dwarf.getName = function() {

    return Dwarf.NAMES_FIRST.random() + ' ' + Dwarf.NAMES_LAST.random();

}

Dwarf.WIDTH = 6;
Dwarf.HEIGHT = 12;

Dwarf.SPEED = .75;

Dwarf.TYPE = 'dwarf';

