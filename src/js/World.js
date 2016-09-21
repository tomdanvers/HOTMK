import PIXI from 'pixi.js';

import Noise from 'noisejs';

import Viewport from './Viewport';

import Tile from './Tile';

import Tree from './Tree';

import Rock from './Rock';

import Supply from './Supply';

import Lighting from './Lighting';

import Buildings from './Buildings';

import Dwarf from './Dwarf';

import DwarfRoles from './DwarfRoles';

import UI from './UI';

import Layout from './Layout';

import TimeOfDay from './TimeOfDay';

export default function World() {

    PIXI.Container.call(this);

    let heightMultiplier = 1;

    World.WIDTH = Math.ceil(Layout.WIDTH / Tile.WIDTH);
    World.HEIGHT = Math.ceil(Layout.HEIGHT / Tile.HEIGHT) * heightMultiplier;

    this.viewport = new Viewport(
        this,
        Math.ceil(Layout.WIDTH / Tile.WIDTH) * Tile.WIDTH,
        Math.ceil(Layout.HEIGHT / Tile.HEIGHT) * Tile.HEIGHT,
        World.WIDTH * Tile.WIDTH,
        World.HEIGHT * Tile.HEIGHT,
        heightMultiplier > 1
    );

    this.randomSeed = Math.floor(Math.random() * 1000);

    console.log('World(', World.WIDTH, World.HEIGHT, this.randomSeed,')');

    this.noise = new Noise.Noise(this.randomSeed);

    this.timeOfLastUpdate = 0;

    this.timeOfDay = new TimeOfDay();

    this.supply = new Supply();

    this.buildings = new Buildings(this);

    this.dwarfRoles = new DwarfRoles(this);

    this.tiles = [];
    this.resources = [];
    this.trees = [];
    this.rocks = [];
    this.dwarves = [];
    this.zOrdered = [];

    this.containerZOrdered = new PIXI.Container();

    this.ui = new UI(this);

    let background = document.createElement('canvas');
    background.width = World.WIDTH * Tile.WIDTH;
    background.height = World.HEIGHT * Tile.HEIGHT;

    this.lighting = new Lighting(this);

    let backgroundCtx = background.getContext('2d');
    for (let y = 0; y < World.HEIGHT; y ++) {

        for (let x = 0; x < World.WIDTH; x ++) {

            let tile = this.addTile(x, y);

            backgroundCtx.drawImage(tile.canvas, x * Tile.WIDTH, y * Tile.HEIGHT);

        }

    }

    this.background = new PIXI.Sprite(PIXI.Texture.fromCanvas(background));

    this.content = new PIXI.Container();

    this.content.addChild(this.background);
    this.content.addChild(this.containerZOrdered);
    this.content.addChild(this.lighting);

    this.addChild(this.content);
    this.addChild(this.ui);

    // Add buildings

    // this.addBuilding(Buildings.ARCHETYPE_BARRACKS.id, Math.floor(World.WIDTH * .5), Math.floor(World.HEIGHT * .5));
    let camp = this.addBuilding(Buildings.ARCHETYPE_CAMP.id, Math.floor(World.WIDTH * .5), Math.floor(World.HEIGHT * .85));

    // Add dwarves

    let forester = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, DwarfRoles.COLLECT_WOOD);
    let miner = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, DwarfRoles.COLLECT_STONE);
    let builder = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, DwarfRoles.BUILDER);

    forester.home = builder.home = miner.home = camp;

    // Add resources

    this.tiles.forEach(function(tile) {

        if (tile.type === Tile.TYPE_GRASS && tile.elevation < .4 && Math.random() > .6) {

            let tree = this.addTree(tile.tileX, tile.tileY);

        } else if (tile.type === Tile.TYPE_GRASS && (tile.elevation > .9 && Math.random() > .5 || Math.random() > .99)) {

            let rock = this.addRock(tile.tileX, tile.tileY);

        }

    }.bind(this))

}

World.constructor = World;
World.prototype = Object.create(PIXI.Container.prototype);

World.prototype.addTile = function(x, y) {

    let tile = new Tile(x, y, this.noise.simplex2(x / World.WIDTH * 2, y / World.WIDTH * 2));

    this.tiles.push(tile);

    return tile;

}

World.prototype.addTree = function(tileX, tileY) {

    if (this.spaceAvailable(tileX, tileY, 1, 1)) {

        let tile = this.getTile(tileX, tileY);

        tile.occupy();

        let offsetX = Tile.WIDTH * .3 * Math.random() - Tile.WIDTH * .15;
        let offsetY = Tile.HEIGHT * .3 * Math.random() - Tile.HEIGHT * .15;

        let tree = new Tree();
        tree.x = tile.x + Tile.WIDTH * .5 + offsetX;
        tree.y = tile.y + Tile.HEIGHT * .5 + offsetY;

        this.resources.push(tree);
        this.trees.push(tree);
        this.zOrdered.push(tree);

        this.containerZOrdered.addChild(tree);

        return tree;

    } else {

        console.warn('Can\'t place tree at', tileX, tileY, 'there is not enough space.');

        return false;

    }

}

World.prototype.addRock = function(tileX, tileY) {

    if (this.spaceAvailable(tileX, tileY, 1, 1)) {

        let tile = this.getTile(tileX, tileY);

        tile.occupy();

        let rock = new Rock();
        rock.x = tile.x + Tile.WIDTH * .5;
        rock.y = tile.y + Tile.HEIGHT * .5;

        this.resources.push(rock);
        this.rocks.push(rock);
        this.zOrdered.push(rock);

        this.containerZOrdered.addChild(rock);

        return rock;

    } else {

        console.warn('Can\'t place rock at', tileX, tileY, 'there is not enough space.');

        return false;

    }

}

World.prototype.addBuilding = function(id, tileX, tileY) {

    let buildingWidth = 1;
    let buildingHeight = 1

    if (this.spaceAvailable(tileX, tileY, buildingWidth, buildingHeight)) {

        let tile = this.getTile(tileX, tileY);

        tile.occupy();

        let building = this.buildings.add(id, this);
        building.x = tile.x + Tile.WIDTH * .5;
        building.y = tile.y + Tile.HEIGHT * .5;

        console.log('World.addBuilding(', id, ')');

        this.zOrdered.push(building);

        this.containerZOrdered.addChild(building);

        this.lighting.addStatic(building.x, building.y, building.lightRadius, 0, -5);

        // let lightCanvas = document.createElement('canvas');
        // lightCanvas.width = lightCanvas.height = radius * 2;

        // let lightCtx = lightCanvas.getContext('2d');

        // let lightGradient = lightCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        // lightGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        // lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        // lightCtx.fillStyle = lightGradient;
        // lightCtx.beginPath();
        // lightCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
        // lightCtx.fill();

        // let light = new PIXI.Sprite(PIXI.Texture.fromCanvas(lightCanvas));
        // light.x = building.x - radius;
        // light.y = building.y - radius - 5;

        // this.nightMask.addChild(light);







        // let gradient = this.nightCtx.createRadialGradient(building.x, building.y - 5, 0, building.x, building.y - 5, radius);
        // gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        // gradient.addColorStop(.4, 'rgba(0, 0, 0, 1)');
        // gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        // this.nightCtx.globalCompositeOperation = 'destination-out';
        // this.nightCtx.fillStyle = gradient;
        // this.nightCtx.beginPath();
        // this.nightCtx.arc(building.x, building.y - 5, radius, 0, 2 * Math.PI);
        // this.nightCtx.fill();

        // this.night.texture = PIXI.Texture.fromCanvas(this.nightCanvas);
        // this.night.texture.update();

        // this.nightMask

        return building;

    } else {

        console.warn('Can\'t place building at', tileX, tileY, 'there is not enough space.');

        return false;

    }


}

World.prototype.buyDwarf = function(x, y, roleId) {

    let role = this.dwarfRoles.getById(roleId);
    let canAfford = this.supply.wood >= role.cWood && this.supply.stone >= role.cStone;

    if (canAfford) {

        this.supply.wood -= role.cWood;
        this.supply.stone -= role.cStone;

        return this.addDwarf(x, y, roleId);

    }


}

World.prototype.addDwarf = function(x, y, role) {

    let dwarf = new Dwarf(this, x, y, role || DwarfRoles.IDLE);

    this.dwarves.push(dwarf);
    this.zOrdered.push(dwarf);

    this.containerZOrdered.addChild(dwarf);

    this.lighting.addEmitter(dwarf, 30, 0, -5);

    return dwarf;

}

World.prototype.update = function(time) {

    let timeDelta = time - this.timeOfLastUpdate;

    this.timeOfLastUpdate = time;

    this.timeOfDay.update(timeDelta, this);

    this.lighting.update(timeDelta, this);

    this.viewport.update(timeDelta, this);

    this.content.y = - this.viewport.scroll;

    this.dwarves.forEach(function(dwarf) {

        dwarf.update(timeDelta, this);

    }.bind(this));

    this.resources.forEach(function(resource) {

        resource.update(timeDelta, this);

    }.bind(this));

    this.buildings.update(timeDelta);

    // Z-Sorting

    this.zOrdered.sort(function(a, b) {

        if (a.y > b.y) {

            return 1;

        } else if(a.y < b.y) {

            return -1;

        } else {

            return 0;

        }

    });

    this.zOrdered.forEach(function(item, index) {

        this.containerZOrdered.setChildIndex(item, index);

    }.bind(this));

    this.supply.update(timeDelta, this);

}

World.prototype.spaceAvailable = function(tileX, tileY, w, h) {

    let valid = true;

    for (let i = tileX; i < tileX + w; i ++) {
        for (let j = tileY; j < tileY + h; j ++) {

            if (this.getTile(i, j).isOccupied) {

                valid = false;
                break;

            }

        }
    }

    return valid;

}

World.prototype.getTileFromWorld = function(x, y) {

    return this.getTile(Math.floor(x / Tile.WIDTH), Math.floor(y / Tile.HEIGHT));

}

World.prototype.getTile = function(x, y) {

    return this.tiles[y * World.WIDTH + x] || false;

}

World.WIDTH = 48;
World.HEIGHT = 32;
