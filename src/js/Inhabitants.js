import * as PIXI from 'pixi.js';

export default class Inhabitants extends PIXI.utils.EventEmitter {

    constructor(world, building) {

        super();

        this.world = world;
        this.building = building;

        this.list = [];

    }

    addArchetype(archetypeId) {

        let archetype = this.world.archetypes.getById(archetypeId);

        this.list.push(new Inhabitant(this.world, this.building, archetype));

    }

    spawn() {

        this.list.forEach(function(inhabitant) {

            if (!inhabitant.isFilled) {

                inhabitant.spawn(false, true)

            }

        });

    }

}


export class Inhabitant extends PIXI.utils.EventEmitter {

    constructor(world, building, archetype) {

        super();

        this.world = world;
        this.building = building;
        this.archetype = archetype;

        this.isFilled = false;

    }

    spawn(isPurchased, ignoreContructionState) {

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

    onDeath(dwarf) {

        this.isFilled = false;

        this.dwarf = false;

        this.emit('filled:false');

    }

}
