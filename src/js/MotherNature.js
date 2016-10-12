import World from './World';
import Tile from './Tile';
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

    let animal = new animalArchetype.c(this.world, animalArchetype, World.WIDTH * Tile.WIDTH * Math.random(), World.HEIGHT * Tile.HEIGHT * Math.random());// * .7

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

AnimalArchetype.DEER = new AnimalArchetype('deer', 6, 22, 3, Deer, .9, 100, 1, false, 20);
AnimalArchetype.RABBIT = new AnimalArchetype('rabbit', 4, 15, 4, Rabbit, .8, 60, 1, false, 5);
AnimalArchetype.FOX = new AnimalArchetype('fox', 2, 24, 2, Fox, .9, 70, 5, false, 10);
AnimalArchetype.WOLF = new AnimalArchetype('wolf', 22, 5, 1, Wolf, .9, 120, 10, true, 80);
AnimalArchetype.BOAR = new AnimalArchetype('boar', 4, 23, 10, Boar, .6, 60, 10, true, 100);


function AnimalArchetype(id, startTime, endTime, maxConcurrent, c, speed, perceptionRange, damage, isAggressive, health) {

    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.maxConcurrent = maxConcurrent;
    this.c = c || false;
    this.speed = speed;
    this.perceptionRange = perceptionRange;
    this.damage = damage;
    this.isAggressive = isAggressive;
    this.health = health;

}

AnimalArchetype.constructor = AnimalArchetype;
