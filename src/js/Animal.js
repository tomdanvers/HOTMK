import PIXI from 'pixi.js';

import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

import Creature from './Creature';

export default function Animal(world, startX, startY, archetype) {

    Creature.call(this, world, startX, startY, archetype);

    this.name = 'animal';

    this.type = Animal.TYPE;

}

Animal.constructor = Animal;
Animal.prototype = Object.create(Creature.prototype);

Animal.prototype.getAppearance = function(roleId) {

    let base = new PIXI.Graphics();

    this.draw(base);

    return base;

}

Animal.prototype.draw = function(graphics) {

    graphics.beginFill(0xAAAAAA);
    graphics.drawRect(- Animal.WIDTH * .5, - Animal.HEIGHT, Animal.WIDTH, Animal.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x666666);
    graphics.drawRect(- Animal.WIDTH * .5 + 4, -10, Animal.WIDTH - 8, 10);
    graphics.endFill();

}

Animal.WIDTH = 10;
Animal.HEIGHT = 6;

Animal.TYPE = 'animal';

Animal.VERBOSE = false;


/* -------------- */
/* --------- DEER */
/* -------------- */

export function Deer(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype);

    this.name = 'Deer';

}

Deer.constructor = Deer;
Deer.prototype = Object.create(Animal.prototype);

Deer.prototype.draw = function(graphics) {

    graphics.beginFill(0x523013);
    graphics.drawRect(- Deer.WIDTH * .5, - Deer.HEIGHT, Deer.WIDTH, Deer.HEIGHT);
    graphics.endFill();

}

Deer.WIDTH = 10;
Deer.HEIGHT = 6;

/* -------------- */
/* ------- RABBIT */
/* -------------- */

export function Rabbit(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype);

    this.name = 'Rabbit';

}

Rabbit.constructor = Rabbit;
Rabbit.prototype = Object.create(Animal.prototype);

Rabbit.prototype.draw = function(graphics) {

    graphics.beginFill(0x61443A);
    graphics.drawRect(- Rabbit.WIDTH * .5, - Rabbit.HEIGHT, Rabbit.WIDTH, Rabbit.HEIGHT);
    graphics.endFill();

}

Rabbit.WIDTH = 2;
Rabbit.HEIGHT = 2;

/* -------------- */
/* ---------- FOX */
/* -------------- */

export function Fox(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype);

    this.name = 'Fox';

}

Fox.constructor = Fox;
Fox.prototype = Object.create(Animal.prototype);

Fox.prototype.draw = function(graphics) {

    graphics.beginFill(0x8C3C12);
    graphics.drawRect(- Fox.WIDTH * .5, - Fox.HEIGHT, Fox.WIDTH, Fox.HEIGHT);
    graphics.endFill();

}

Fox.WIDTH = 4;
Fox.HEIGHT = 2;

/* -------------- */
/* --------- WOLF */
/* -------------- */

export function Wolf(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype);

    this.name = 'Wolf';

}

Wolf.constructor = Wolf;
Wolf.prototype = Object.create(Animal.prototype);

Wolf.prototype.draw = function(graphics) {

    graphics.beginFill(0x4C484A);
    graphics.drawRect(- Wolf.WIDTH * .5, - Wolf.HEIGHT, Wolf.WIDTH, Wolf.HEIGHT);
    graphics.endFill();

}

Wolf.WIDTH = 8;
Wolf.HEIGHT = 4;

/* -------------- */
/* --------- WOLF */
/* -------------- */

export function Boar(world, startX, startY, archetype) {

    Animal.call(this, world, startX, startY, archetype);

    this.name = 'Boar';

}

Boar.constructor = Boar;
Boar.prototype = Object.create(Animal.prototype);

Boar.prototype.draw = function(graphics) {

    graphics.beginFill(0x191719);
    graphics.drawRect(- Boar.WIDTH * .5, - Boar.HEIGHT, Boar.WIDTH, Boar.HEIGHT);
    graphics.endFill();

}

Boar.WIDTH = 8;
Boar.HEIGHT = 5;
