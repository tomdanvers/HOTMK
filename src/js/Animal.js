import * as PIXI from 'pixi.js';

import ValueMinMax from './utils/ValueMinMax';
import Maths from './utils/Maths';

import Creature from './Creature';

export default class Animal extends Creature {

    constructor(world, startX, startY, archetype, appearanceWidth, appearanceHeight) {

        super(world, startX, startY, archetype, appearanceWidth, appearanceHeight);

        this.name = 'animal';

        this.type = Animal.TYPE;

        this.enemies = world.dwarves;

    }

    getAppearance() {

        return new PIXI.Sprite(PIXI.Texture.fromImage('img/' + this.archetype.id + '.png'));

    }

}

Animal.TYPE = 'animal';
Animal.VERBOSE = false;

/* -------------- */
/* --------- DEER */
/* -------------- */

export class Deer extends Animal {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 15, 11);

        this.name = 'Deer';

    }

}

/* -------------- */
/* ------- RABBIT */
/* -------------- */

export class Rabbit extends Animal {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 2, 3);

        this.name = 'Rabbit';

    }

}

/* -------------- */
/* ---------- FOX */
/* -------------- */

export class Fox extends Animal {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 9, 4);

        this.name = 'Fox';

    }

}

/* -------------- */
/* --------- WOLF */
/* -------------- */

export class Wolf extends Animal {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 16, 9);

        this.name = 'Wolf';

    }

}

/* -------------- */
/* --------- BOAR */
/* -------------- */

export class Boar extends Animal {

    constructor(world, startX, startY, archetype) {

        super(world, startX, startY, archetype, 12, 8);

        this.name = 'Boar';

    }

}
