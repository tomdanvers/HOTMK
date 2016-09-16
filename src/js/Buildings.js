import Barracks from './Barracks';

export default function Buildings(world) {

    this.world = world;

    this.archetypes = [
        Buildings.ARCHETYPE_BARRACKS,
        Buildings.ARCHETYPE_TAVERN
    ];

    this.archetypesMap = {};

    this.archetypes.forEach(function(archetype) {
        this.archetypesMap[archetype.id] = archetype;
    }.bind(this))

    this.buildings = [];

}

Buildings.constructor = Buildings;

Buildings.prototype.add = function(id) {

    let building = new this.archetypesMap[id].c(this.world);

    this.buildings.push(building);

    return building;

}

Buildings.prototype.update = function(timeDelta) {

    this.buildings.forEach(function(building) {

        building.update(timeDelta, this.world);

    }.bind(this));

}

Buildings.ARCHETYPE_BARRACKS = new BuildingArchetype('barracks', 'Barracks', 'A dwarven barracks', 50, 50, Barracks);
Buildings.ARCHETYPE_TAVERN = new BuildingArchetype('tavern', 'Tavern', 'Here be Ale and Mead', 150, 100, Barracks);


function BuildingArchetype(id, title, description, cWood, cStone, c) {

    this.id = id;
    this.title = title;
    this.description = description;
    this.cWood = cWood;
    this.cStone = cStone;
    this.c = c;

}

BuildingArchetype.constructor = BuildingArchetype;
