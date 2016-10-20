import PIXI from 'pixi.js';

import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

import Creature from './Creature';

export default function Animal(world, startX, startY, archetype, appearanceWidth, appearanceHeight) {

    Creature.call(this, world, startX, startY, archetype, appearanceWidth, appearanceHeight);

    this.name = 'animal';

    this.type = Animal.TYPE;
}

Animal.constructor = Animal;
Animal.prototype = Object.create(Creature.prototype);

Animal.prototype.getAppearance = function(roleId) {

    let base = new PIXI.Sprite(PIXI.Texture.fromImage('img/' + this.archetype.id + '.png'));
    return base;

}

Animal.TYPE = 'animal';

Animal.VERBOSE = false;


/* -------------- */
/* --------- DEER */
/* -------------- */

export function Deer(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype, 15, 11);

    this.name = 'Deer';

}

Deer.constructor = Deer;
Deer.prototype = Object.create(Animal.prototype);

/* -------------- */
/* ------- RABBIT */
/* -------------- */

export function Rabbit(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype, 2, 3);

    this.name = 'Rabbit';

}

Rabbit.constructor = Rabbit;
Rabbit.prototype = Object.create(Animal.prototype);

/* -------------- */
/* ---------- FOX */
/* -------------- */

export function Fox(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype, 9, 4);

    this.name = 'Fox';

}

Fox.constructor = Fox;
Fox.prototype = Object.create(Animal.prototype);

/* -------------- */
/* --------- WOLF */
/* -------------- */

export function Wolf(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype, 16, 9);

    this.name = 'Wolf';

}

Wolf.constructor = Wolf;
Wolf.prototype = Object.create(Animal.prototype);

/* -------------- */
/* --------- BOAR */
/* -------------- */

export function Boar(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype, 12, 8);

    this.name = 'Boar';

}

Boar.constructor = Boar;
Boar.prototype = Object.create(Animal.prototype);
