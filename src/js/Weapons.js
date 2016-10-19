export default function Weapons(world) {

    this.world = world;

    this.archetypes = [
        Weapons.FISTS
    ];

    this.archetypesMap = {};

    this.archetypes.forEach(function(archetype) {
        this.archetypesMap[archetype.id] = archetype;
    }.bind(this));

}

Weapons.constructor = Weapons;

Weapons.FISTS = new WeaponArchetype('fists', 'Bare fists', 1, 5);
Weapons.HAMMER = new WeaponArchetype('hammer', 'Mason\'s hammer', 3, 5);
Weapons.PICKAXE = new WeaponArchetype('pickaxe', 'Miner\'s pickaxe', 3, 5);
Weapons.AXE = new WeaponArchetype('axe', 'Forester\'s wood axe', 5, 5);
Weapons.BATTLEAXE = new WeaponArchetype('battleaxe', 'Battle axe', 15, 5);
Weapons.BOW = new WeaponArchetype('bow', 'Short bow', 20, 100);

Weapons.TUSKS = new WeaponArchetype('tusks', 'Tusks', 8, 5);
Weapons.CLAWS = new WeaponArchetype('claws', 'Claws', 10, 5);


function WeaponArchetype(id, title, damage, range) {

    this.id = id;
    this.type = 'weapon';
    this.title = title;
    this.damage = damage;
    this.range = range;

}

WeaponArchetype.constructor = WeaponArchetype;
