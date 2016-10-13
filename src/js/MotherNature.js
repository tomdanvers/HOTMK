import World from './World';
import Tile from './Tile';
import {Deer as ADeer, Rabbit as ARabbit, Fox as AFox, Wolf as AWolf, Boar as ABoar} from './Archetypes';
import {Deer, Rabbit, Fox, Wolf, Boar} from './Animal';

export default function MotherNature(world) {

    this.world = world;

    this.animalArchetypes = [
        AnimalArchetype.DEER,
        AnimalArchetype.RABBIT,
        AnimalArchetype.FOX,
        AnimalArchetype.WOLF,
        AnimalArchetype.BOAR
    ];

    this.animalsMap = {};
    this.animals = [];

    this.animalArchetypes.forEach(function(animalArchetype) {

        this.animalsMap[animalArchetype.id] = [];

    }.bind(this));

}

MotherNature.constructor = MotherNature;

MotherNature.prototype.update = function(timeDelta) {

    this.animalArchetypes.forEach(function(animalArchetype) {

        if (Math.random() > .99 && this.animalsMap[animalArchetype.id].length < animalArchetype.maxConcurrent && this.world.timeOfDay.isDuringPeriod(animalArchetype.startTime, animalArchetype.endTime)) {

            console.log('MotherNature.spawnAnimal(',animalArchetype.id,')');

            this.spawn(animalArchetype);

        }

    }.bind(this));

}

MotherNature.prototype.spawn = function(animalArchetype) {

    let animal = new animalArchetype.c(this.world, World.WIDTH * Tile.WIDTH * Math.random(), World.HEIGHT * Tile.HEIGHT * Math.random() * .7, animalArchetype.archetype);// * .7

    this.world.addToZOrdered(animal);

    this.animalsMap[animalArchetype.id].push(animal);
    this.animals.push(animal);

}

MotherNature.prototype.removeAnimal = function(animal) {

    this.animalArchetypes.forEach(function(animalArchetype) {

        for(let i = 0; i < this.animalsMap[animalArchetype.id].length; i ++) {

            if (animal === this.animalsMap[animalArchetype.id][i]) {

                this.animalsMap[animalArchetype.id].splice(i, 1);

                break;

            }

        }

    }.bind(this));

    for(let i = 0; i < this.animals.length; i ++) {

        if (animal === this.animals[i]) {

            this.animals.splice(i, 1);

            break;

        }

    }

}

AnimalArchetype.RABBIT = new AnimalArchetype('rabbit', 4, 15, 4, Rabbit, new ARabbit());
AnimalArchetype.DEER = new AnimalArchetype('deer', 6, 22, 3, Deer, new ADeer());
AnimalArchetype.FOX = new AnimalArchetype('fox', 2, 24, 2, Fox, new AFox());
AnimalArchetype.BOAR = new AnimalArchetype('boar', 4, 23, 10, Boar, new ABoar());
AnimalArchetype.WOLF = new AnimalArchetype('wolf', 22, 5, 1, Wolf, new AWolf());


function AnimalArchetype(id, startTime, endTime, maxConcurrent, c, archetype) {

    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.maxConcurrent = maxConcurrent;
    this.c = c || false;
    this.archetype = archetype;

}

AnimalArchetype.constructor = AnimalArchetype;
