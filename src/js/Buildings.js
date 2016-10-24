import {Camp, Miner, Forester, Mason, Hunter, Barracks, NightWatch, DayWatch, Healer} from './Building';

export default class Buildings {

    constructor(world) {

        this.world = world;

        this.archetypes = [
            Buildings.ARCHETYPE_MINER,
            Buildings.ARCHETYPE_FORESTER,
            Buildings.ARCHETYPE_MASON,
            Buildings.ARCHETYPE_HUNTER,
            Buildings.ARCHETYPE_BARRACKS,
            Buildings.ARCHETYPE_DAYWATCH,
            Buildings.ARCHETYPE_NIGHTWATCH,
            Buildings.ARCHETYPE_HEALER
        ];

        //console.table(this.archetypes);

        this.archetypesMap = {};

        this.archetypes.forEach(function(archetype) {

            this.archetypesMap[archetype.id] = archetype;

        }.bind(this));

        this.archetypesMap['camp'] = Buildings.ARCHETYPE_CAMP;

        this.buildings = [];

    }

    add(id, x, y) {

        let archetype = this.archetypesMap[id];

        let building = new archetype.c(this.world, x, y, archetype, false);

        this.buildings.push(building);

        return building;

    }

    update(timeDelta) {

        this.buildings.forEach(function(building) {

            building.update(timeDelta, this.world);

        }.bind(this));

    }

}

class BuildingArchetype {

    constructor(id, title, description, cWood, cStone, c) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.cWood = cWood;
        this.cStone = cStone;
        this.c = c || false;

    }

}

Buildings.ARCHETYPE_CAMP = new BuildingArchetype('camp', 'Camp', 'A settler\'s camp', 0, 0, Camp);
Buildings.ARCHETYPE_MINER = new BuildingArchetype('miner', 'Miner\'s Cottage', 'A lowly home for a miner', 100, 50, Miner);
Buildings.ARCHETYPE_FORESTER = new BuildingArchetype('forester', 'Forester\'s Cottage', 'A lowly home for a forester', 50, 100, Forester);
Buildings.ARCHETYPE_MASON = new BuildingArchetype('mason', 'Mason\'s Cottage', 'A builder\'s home', 150, 150, Mason);
Buildings.ARCHETYPE_HUNTER = new BuildingArchetype('hunter', 'Hunter\'s Shack', 'A hunter\'s shack', 100, 100, Hunter);
Buildings.ARCHETYPE_BARRACKS = new BuildingArchetype('barracks', 'Barracks', 'A dwarven barracks', 200, 200, Barracks);
Buildings.ARCHETYPE_DAYWATCH = new BuildingArchetype('day-watch', 'The Watch', 'A watch house that patrols during the day', 200, 200, DayWatch);
Buildings.ARCHETYPE_NIGHTWATCH = new BuildingArchetype('night-watch', 'The Night Watch', 'A watch house that patrols during the hours of darkness', 200, 200, NightWatch);
Buildings.ARCHETYPE_HEALER = new BuildingArchetype('healer', 'Healer\'s Home', 'A den of herbal healing', 120, 80, Healer);
