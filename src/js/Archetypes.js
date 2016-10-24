import Roles from './Roles';
import Weapons from './Weapons';

export default class Archetypes {

    constructor() {

        this.archetypesMap = {
            'mason': new Mason(),
            'miner': new Miner(),
            'forester': new Forester(),
            'hunter': new Hunter(),
            'watch-day': new WatchDay(),
            'watch-night': new WatchNight(),
            'healer': new Healer(),

            'animal-rabbit': new Rabbit(),
            'animal-deer': new Deer(),
            'animal-fox': new Fox(),
            'animal-boar': new Boar(),
            'animal-wolf': new Wolf()
        };

    }

    getById(id) {

        return this.archetypesMap[id];

    }

}

Archetypes.MASON = 'mason';
Archetypes.MINER = 'miner';
Archetypes.FORESTER = 'forester';
Archetypes.HUNTER = 'hunter';
Archetypes.WATCH_DAY = 'watch-day';
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

class Dwarf {

    constructor() {

        this.timeBetweenActions = 1500;

        this.range = 5;
        this.rangePerception = 125;
        this.rangeLimit = 200;

        this.lightRadius = 0;

        this.colour = 0xFF0000;

        this.speed = .75;
        this.stealthiness = .25;
        this.health = 100;

        this.cWood = 5;
        this.cStone = 5;

        this.weapons = [Weapons.FISTS];

    }

}



/* --------------------------------- */
/* --------------------------- MASON */
/* --------------------------------- */

export class Mason extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.MASON;
        this.role = Roles.BUILDER;

        this.colour = 0x333355;

        this.cWood = 50;
        this.cStone = 50;

        this.weapons = [Weapons.HAMMER];

    }

}



/* --------------------------------- */
/* --------------------------- MINER */
/* --------------------------------- */

export class Miner extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.MINER;
        this.role = Roles.COLLECT_STONE;

        this.colour = 0x444444;

        this.cWood = 40;
        this.cStone = 20;

        this.weapons = [Weapons.PICKAXE];

    }

}



/* --------------------------------- */
/* ------------------------ FORESTER */
/* --------------------------------- */

export class Forester extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.FORESTER;
        this.role = Roles.COLLECT_WOOD;

        this.colour = 0x335533;

        this.stealthiness = .8;

        this.cWood = 20;
        this.cStone = 40;

        this.weapons = [Weapons.AXE];

    }

}



/* --------------------------------- */
/* -------------------------- HUNTER */
/* --------------------------------- */

export class Hunter extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.HUNTER;
        this.role = Roles.HUNTER;

        this.lightRadius = 45;

        this.rangePerception = 200;

        this.colour = 0x58240A;

        this.stealthiness = .9;

        this.cWood = 50;
        this.cStone = 50;

        this.weapons = [Weapons.BOW];

    }

}



/* --------------------------------- */
/* ----------------------- WATCH DAY */
/* --------------------------------- */


export class WatchDay extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.WATCH_DAY;
        this.role = Roles.WATCH_DAY;

        this.colour = 0x555533;

        this.stealthiness = .25;

        this.cWood = 50;
        this.cStone = 50;

        this.weapons = [Weapons.BOW, Weapons.BATTLEAXE];

    }

}



/* --------------------------------- */
/* --------------------- WATCH NIGHT */
/* --------------------------------- */


export class WatchNight extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.WATCH_NIGHT;
        this.role = Roles.WATCH_NIGHT;

        this.colour = 0x553333;

        this.stealthiness = .25;

        this.lightRadius = 60;

        this.cWood = 50;
        this.cStone = 50;

        this.weapons = [Weapons.BOW, Weapons.BATTLEAXE];

    }

}


/* --------------------------------- */
/* -------------------------- HEALER */
/* --------------------------------- */


export class Healer extends Dwarf {

    constructor() {

        super();

        this.id = Archetypes.HEALER;
        this.role = Roles.HEALER;

        this.colour = 0x999999;

        this.stealthiness = .25;

        this.speed = .85;
        this.range = 10;

        this.cWood = 50;
        this.cStone = 50;

        this.weapons = [];

    }

}



/* --------------------------------- */
/* --------------------- ANIMAL BASE */
/* --------------------------------- */


class Animal {

    constructor() {

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

}


/* --------------------------------- */
/* -------------------------- RABBIT */
/* --------------------------------- */


export class Rabbit extends Animal {

    constructor() {

        super();

        this.id = Archetypes.ANIMAL_RABBIT;
        this.role = Roles.PREY;

        this.colour = 0x553333;

        this.speed = .8;
        this.rangePerception = 60;
        this.health = 5;

    }

}


/* --------------------------------- */
/* ---------------------------- DEER */
/* --------------------------------- */


export class Deer extends Animal {

    constructor() {

        super();

        this.id = Archetypes.ANIMAL_DEER;
        this.role = Roles.PREY;

        this.colour = 0x553333;

        this.speed = .9;
        this.rangePerception = 100;
        this.health = 20;

    }

}


/* --------------------------------- */
/* ----------------------------- FOX */
/* --------------------------------- */


export class Fox extends Animal {

    constructor() {

        super();

        this.id = Archetypes.ANIMAL_FOX;
        this.role = Roles.PREY;

        this.colour = 0x553333;

        this.speed = .9;
        this.rangePerception = 70;
        this.health = 10;

    }

}


/* --------------------------------- */
/* ---------------------------- BOAR */
/* --------------------------------- */


export class Boar extends Animal {

    constructor() {

        super();

        this.id = Archetypes.ANIMAL_BOAR;
        this.role = Roles.PREDATOR;

        this.colour = 0x553333;

        this.speed = .6;
        this.rangePerception = 60;
        this.health = 100;

        this.weapons = [Weapons.TUSKS];

    }

}



/* --------------------------------- */
/* ---------------------------- WOLF */
/* --------------------------------- */


export class Wolf extends Animal {

    constructor() {

        super();

        this.id = Archetypes.ANIMAL_WOLF;
        this.role = Roles.PREDATOR;

        this.colour = 0x553333;

        this.speed = .9;
        this.rangePerception = 120;
        this.health = 80;

        this.weapons = [Weapons.CLAWS];

    }

}
