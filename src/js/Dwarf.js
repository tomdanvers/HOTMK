import PIXI from 'pixi.js';
import Maths from './utils/Maths';

import Creature from './Creature';

export default class Dwarf extends Creature {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 6, 14);

        this.type = Dwarf.TYPE;

        this.name = Dwarf.getName();

        if (archetype.lightRadius) {

            this.light = this.world.lighting.addEmitter(this, archetype.lightRadius, 0, -10);

        }

        // TEMP test healer
        this.takeDamage(10);

    }

    getAppearance(roleId) {

        let base = new PIXI.Sprite(PIXI.Texture.fromImage('img/dwarf.png'));
        return base;

    }

}

Dwarf.NAMES_FIRST = ['Snorri', 'Ori', 'Nori', 'Gloin', 'Oin', 'Bifur', 'Bofur', 'Thorin', 'Balin'];
Dwarf.NAMES_LAST = ['Oakenshield', 'Bittenaxe', 'Longbeard', 'Undermountain', 'Ironskull', 'Steelhammer', 'Goldring'];

Dwarf.getName = function() {

    return Dwarf.NAMES_FIRST.random() + ' ' + Dwarf.NAMES_LAST.random();

}

Dwarf.TYPE = 'dwarf';
