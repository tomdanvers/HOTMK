import PIXI from 'pixi.js';

export default function Inhabitants(world, building) {

    PIXI.utils.EventEmitter.call(this);

    this.world = world;
    this.building = building;

    this.list = [];

}

Inhabitants.constructor = Inhabitants;
Inhabitants.prototype = Object.create(PIXI.utils.EventEmitter.prototype);

Inhabitants.prototype.addArchetype = function(archetypeId) {

    let archetype = this.world.archetypes.getById(archetypeId);

    this.list.push(new Inhabitant(this.world, this.building, archetype));

}

Inhabitants.prototype.spawn = function() {

    this.list.forEach(function(inhabitant) {

        if (!inhabitant.isFilled) {

            inhabitant.spawn(false, true)

        }

    });

}

export function Inhabitant(world, building, archetype) {

    PIXI.utils.EventEmitter.call(this);

    this.world = world;
    this.building = building;
    this.archetype = archetype;

    this.isFilled = false;

}

Inhabitant.constructor = Inhabitant;
Inhabitant.prototype = Object.create(PIXI.utils.EventEmitter.prototype);

Inhabitant.prototype.spawn = function(isPurchased, ignoreContructionState) {

    //if (this.timeSinceSpawn > Building.SPAWN_RATE && this.isConstructed) {
    if (this.building.isConstructed || ignoreContructionState) {

        this.building.timeSinceSpawn = 0;

        let dwarf;

        console.log('Inhabitant.prototype.spawn(',this.archetype.id,')');

        if (isPurchased) {

            dwarf = this.world.buyDwarf(this.building.x + Math.random() * 3, this.building.y + Math.random() * 3, this.archetype.id);

        } else {

            dwarf = this.world.addDwarf(this.building.x + Math.random() * 3, this.building.y + Math.random() * 3, this.archetype.id);

        }

        if (dwarf) {

            dwarf.home = this.building;

            dwarf.on('death', this.onDeath.bind(this));

            this.isFilled = true;

            this.dwarf = dwarf;

            this.emit('filled:true');

        } else {

            console.warn('Inhabitant.spawn( COULDN\'T AFFORD TO SPAWN )')

        }

    }

}

Inhabitant.prototype.onDeath = function(dwarf) {

    this.isFilled = false;

    this.dwarf = false;

    this.emit('filled:false');

}
