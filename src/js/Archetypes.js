import Roles from './Roles';
import Weapons from './Weapons';

export default function Archetypes() {

    this.archetypesMap = {
        'mason': new Mason(),
        'miner': new Miner(),
        'forester': new Forester(),
        'hunter': new Hunter(),
        'watch-night': new WatchNight(),
        'healer': new Healer(),

        'animal-rabbit': new Rabbit(),
        'animal-deer': new Deer(),
        'animal-fox': new Fox(),
        'animal-boar': new Boar(),
        'animal-wolf': new Wolf()
    };

}

Archetypes.constructor = Archetypes;

Archetypes.prototype.getById = function(id) {

    return this.archetypesMap[id];

}

Archetypes.MASON = 'mason';
Archetypes.MINER = 'miner';
Archetypes.FORESTER = 'forester';
Archetypes.HUNTER = 'hunter';
Archetypes.WATCH_NIGHT = 'watch-night';
Archetypes.HEALER = 'healer';

Archetypes.ANIMAL_RABBIT = 'animal-rabbit';
Archetypes.ANIMAL_DEER = 'animal-deer';
Archetypes.ANIMAL_FOX = 'animal-fox';
Archetypes.ANIMAL_BOAR = 'animal-boar';
Archetypes.ANIMAL_WOLF = 'animal-wolf';



/* --------------------------------- */
/* ---------------------- DWARF BASE */
/* --------------------------------- */

function Dwarf() {

    this.timeBetweenActions = 1500;

    this.range = 5;
    this.rangePerception = 150;
    this.rangeLimit = 300;

    this.lightRadius = 45;

    this.colour = 0xFF0000;

    this.speed = .75;
    this.stealthiness = .25;
    this.health = 100;

    this.cWood = 5;
    this.cStone = 5;

    this.weapons = [Weapons.FISTS];

}

Dwarf.constructor = Dwarf;



/* --------------------------------- */
/* --------------------------- MASON */
/* --------------------------------- */

export function Mason() {

    Dwarf.call(this);

    this.id = Archetypes.MASON;
    this.role = Roles.BUILDER;

    this.colour = 0x333355;

    this.cWood = 50;
    this.cStone = 50;

    this.weapons = [Weapons.HAMMER];

}
Mason.constructor = Mason;
Mason.prototype = Object.create(Dwarf.prototype);



/* --------------------------------- */
/* --------------------------- MINER */
/* --------------------------------- */

export function Miner() {

    Dwarf.call(this);

    this.id = Archetypes.MINER;
    this.role = Roles.COLLECT_STONE;

    this.colour = 0x444444;

    this.cWood = 40;
    this.cStone = 20;

    this.weapons = [Weapons.PICKAXE];

}
Miner.constructor = Miner;
Miner.prototype = Object.create(Dwarf.prototype);



/* --------------------------------- */
/* ------------------------ FORESTER */
/* --------------------------------- */

export function Forester() {

    Dwarf.call(this);

    this.id = Archetypes.FORESTER;
    this.role = Roles.COLLECT_WOOD;

    this.colour = 0x335533;

    this.stealthiness = .8;

    this.cWood = 20;
    this.cStone = 40;

    this.weapons = [Weapons.AXE];

}
Forester.constructor = Forester;
Forester.prototype = Object.create(Dwarf.prototype);



/* --------------------------------- */
/* -------------------------- HUNTER */
/* --------------------------------- */

export function Hunter() {

    Dwarf.call(this);

    this.id = Archetypes.HUNTER;
    this.role = Roles.HUNTER;

    this.lightRadius = 60;

    this.rangePerception = 150;

    this.colour = 0x58240A;

    this.stealthiness = .9;

    this.cWood = 50;
    this.cStone = 50;

    this.weapons = [Weapons.BOW];

}
Hunter.constructor = Hunter;
Hunter.prototype = Object.create(Dwarf.prototype);



/* --------------------------------- */
/* --------------------- WATCH NIGHT */
/* --------------------------------- */


export function WatchNight() {

    Dwarf.call(this);

    this.id = Archetypes.WATCH_NIGHT;
    this.role = Roles.WATCH_NIGHT;

    this.colour = 0x553333;

    this.stealthiness = .25;

    this.cWood = 50;
    this.cStone = 50;

    this.weapons = [Weapons.BOW, Weapons.BATTLEAXE];

}
WatchNight.constructor = WatchNight;
WatchNight.prototype = Object.create(Dwarf.prototype);


/* --------------------------------- */
/* -------------------------- HEALER */
/* --------------------------------- */


export function Healer() {

    Dwarf.call(this);

    this.id = Archetypes.HEALER;
    this.role = Roles.HEALER;

    this.colour = 0x999999;

    this.stealthiness = .25;

    this.cWood = 50;
    this.cStone = 50;

    this.weapons = [];

}
Healer.constructor = Healer;
Healer.prototype = Object.create(Dwarf.prototype);



/* --------------------------------- */
/* --------------------- ANIMAL BASE */
/* --------------------------------- */


function Animal() {

    this.timeBetweenActions = 1500;

    this.range = 5;
    this.rangePerception = 150;
    this.rangeLimit = 400;

    this.lightRadius = 0;

    this.colour = 0xFF0000;

    this.speed = .75;
    this.stealthiness = .25;
    this.health = 10;

    this.cWood = 0;
    this.cStone = 0;

    this.weapons = [];

}
Animal.constructor = Animal;



/* --------------------------------- */
/* -------------------------- RABBIT */
/* --------------------------------- */


export function Rabbit() {

    Animal.call(this);

    this.id = Archetypes.ANIMAL_RABBIT;
    this.role = Roles.PREY;

    this.colour = 0x553333;

    this.speed = .8;
    this.rangePerception = 60;
    this.health = 5;

}
Rabbit.constructor = Rabbit;
Rabbit.prototype = Object.create(Animal.prototype);



/* --------------------------------- */
/* ---------------------------- DEER */
/* --------------------------------- */


export function Deer() {

    Animal.call(this);

    this.id = Archetypes.ANIMAL_DEER;
    this.role = Roles.PREY;

    this.colour = 0x553333;

    this.speed = .9;
    this.rangePerception = 100;
    this.health = 20;

}
Deer.constructor = Deer;
Deer.prototype = Object.create(Animal.prototype);



/* --------------------------------- */
/* ----------------------------- FOX */
/* --------------------------------- */


export function Fox() {

    Animal.call(this);

    this.id = Archetypes.ANIMAL_FOX;
    this.role = Roles.PREY;

    this.colour = 0x553333;

    this.speed = .9;
    this.rangePerception = 70;
    this.health = 10;

}
Fox.constructor = Fox;
Fox.prototype = Object.create(Animal.prototype);



/* --------------------------------- */
/* ---------------------------- BOAR */
/* --------------------------------- */


export function Boar() {

    Animal.call(this);

    this.id = Archetypes.ANIMAL_BOAR;
    this.role = Roles.PREDATOR;

    this.colour = 0x553333;

    this.speed = .6;
    this.rangePerception = 60;
    this.health = 100;

    this.weapons = [Weapons.TUSKS];

}
Boar.constructor = Boar;
Boar.prototype = Object.create(Animal.prototype);



/* --------------------------------- */
/* ---------------------------- WOLF */
/* --------------------------------- */


export function Wolf() {

    Animal.call(this);

    this.id = Archetypes.ANIMAL_WOLF;
    this.role = Roles.PREDATOR;

    this.colour = 0x553333;

    this.speed = .9;
    this.rangePerception = 120;
    this.health = 80;

    this.weapons = [Weapons.CLAWS];

}
Wolf.constructor = Wolf;
Wolf.prototype = Object.create(Animal.prototype);



