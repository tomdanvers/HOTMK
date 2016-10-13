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

import Animal from './Animal';

import Roles from './Roles';

import Archetypes from './Archetypes';

import MotherNature from './MotherNature';

import UI from './UI';

import Layout from './Layout';

import TimeOfDay from './TimeOfDay';

import ZOrdered from './ZOrdered';

export default function World() {

    PIXI.Container.call(this);

    let heightMultiplier = 2;

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

    // GOOD RANDOM SEEDS
    // 182
    // 353
    // 686
    // 746
    // 776
    // 806
    // 841
    // 929

    this.noise = new Noise.Noise(this.randomSeed);

    this.timeOfLastUpdate = 0;

    this.supply = new Supply();

    this.timeOfDay = new TimeOfDay();

    this.motherNature = new MotherNature(this);

    this.buildings = new Buildings(this);

    this.roles = new Roles(this);

    this.archetypes = new Archetypes(this);

    this.tiles = [];
    this.resources = [];
    this.trees = [];
    this.rocks = [];
    this.dwarves = [];
    this.zOrdered = [];

    this.containerZOrdered = new PIXI.Container();

    this.ui = new UI(this);

    this.ui.log.log('New game started. Random seed is ' + this.randomSeed);

    let background = document.createElement('canvas');
    background.width = World.WIDTH * Tile.WIDTH;
    background.height = World.HEIGHT * Tile.HEIGHT;

    this.lighting = new Lighting(this);

    this.containerLights = new PIXI.Container();
    this.containerLights.blendMode = PIXI.BLEND_MODES.SCREEN;

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
    this.content.addChild(this.containerLights);
    this.content.addChild(this.lighting);

    this.addChild(this.content);
    this.addChild(this.ui);

    // Add buildings

    let camp = this.addBuilding(Buildings.ARCHETYPE_CAMP.id, Math.floor(World.WIDTH * .5), Math.floor(World.HEIGHT - 5));

    // Add dwarves

    let forester = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, Archetypes.FORESTER);
    let miner = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, Archetypes.MINER);
    let builder = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, Archetypes.MASON);
    // let hunter = this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * Tile.HEIGHT + 30, Archetypes.HUNTER);

    forester.home = builder.home = miner.home = camp;
    // forester.home = builder.home = miner.home = hunter.home = camp;

    // Add resources

    this.tiles.forEach(function(tile) {

        if (tile.type === Tile.TYPE_GRASS && tile.elevation < .4 && Math.random() > .6) {

            let tree = this.addTree(tile.tileX, tile.tileY);

        } else if (tile.type === Tile.TYPE_GRASS && (tile.elevation > .9 && Math.random() > .5 || Math.random() > .99)) {

            let rock = this.addRock(tile.tileX, tile.tileY);

        }

    }.bind(this));

}

World.constructor = World;
World.prototype = Object.create(PIXI.Container.prototype);

World.prototype.addTile = function(x, y) {

    let tile = new Tile(x, y, this.noise.simplex2(x / World.WIDTH * 2, y / World.WIDTH * 2));

    this.tiles.push(tile);

    return tile;

}

World.prototype.addToZOrdered = function(item) {

    item.id = ZOrdered.getUniqueID();
    this.zOrdered.push(item);
    this.containerZOrdered.addChild(item);

    if (item.light) {

        this.containerLights.addChild(item.light);

        item.light.x = item.x;
        item.light.y = item.y;

    }

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

        this.addToZOrdered(tree);

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

        this.addToZOrdered(rock);

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

        let building = this.buildings.add(id, tile.x + Tile.WIDTH * .5, tile.y + Tile.HEIGHT * .5);

        // console.log('World.addBuilding(', id, ')');

        this.ui.log.log('Added building of type "' + id + '"');

        this.addToZOrdered(building);

        // Update watchmen patrol routes

        this.buildings.buildings.forEach(function(building) {

            if (building.patrolRoute !== undefined) {

                building.updatePatrolRoute();

            }

        });

        return building;

    } else {

        console.warn('Can\'t place building at', tileX, tileY, 'there is not enough space.');

        return false;

    }


}

World.prototype.buyDwarf = function(x, y, archetypeId) {

    let archetype = this.archetypes.getById(archetypeId);
    let canAfford = this.supply.wood >= archetype.cWood && this.supply.stone >= archetype.cStone;

    if (canAfford) {

        this.supply.wood -= archetype.cWood;
        this.supply.stone -= archetype.cStone;

        return this.addDwarf(x, y, archetype.id);

    }


}

World.prototype.addDwarf = function(x, y, archetypeId) {

    let dwarf = new Dwarf(this, x, y, this.archetypes.getById(archetypeId));

    this.ui.log.log('Added dwarf of type "' + archetypeId + '" called "' + dwarf.name + '"');

    this.dwarves.push(dwarf);

    this.addToZOrdered(dwarf);

    return dwarf;

}

World.prototype.update = function(time) {

    let timeDelta = time - this.timeOfLastUpdate;

    this.timeOfLastUpdate = time;

    this.timeOfDay.update(timeDelta, this);

    this.motherNature.update(timeDelta, this);

    this.lighting.update(timeDelta, this);

    this.viewport.update(timeDelta, this);

    this.content.y = - this.viewport.scroll;

    let killed = [];

    this.motherNature.animals.forEach(function(animal, index) {

        if (animal.isAlive()) {

            animal.update(timeDelta, this);

        } else {

            killed.push(animal);

        }

    }.bind(this));

    this.dwarves.forEach(function(dwarf, index) {

        if (dwarf.isAlive()) {

            dwarf.update(timeDelta, this);

        } else {

            killed.push(dwarf);

        }

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

            if (a.id > b.id) {

                return 1;

            } else if (a.id < b.id) {

                return -1;

            } else {

                return 0;

            }

        }

    });

    this.zOrdered.forEach(function(item, index) {

        if (item.parent === null) {

            this.zOrdered = this.zOrdered.splice(index, 1);

        } else {

            this.containerZOrdered.setChildIndex(item, index);

            if (item.light && this.timeOfDay.getSunValue() > 0) {

                item.light.x = item.x - item.light.radius + item.light.xOffset;
                item.light.y = item.y - item.light.radius + item.light.yOffset;

                item.light.alpha = (this.timeOfDay.getSunValue() - (Math.random() > .9 ? Math.random() * .15 : 0)) * item.light.alphaMultiplier;

            }

        }


    }.bind(this));

    this.supply.update(timeDelta, this);

    killed.forEach(function(entity) {

        switch(entity.type) {
            case Dwarf.TYPE:

                for(let d = 0; d < this.dwarves.length; d ++) {

                    if (this.dwarves[d] === entity) {

                        this.dwarves.splice(d, 1);
                        break;

                    }

                }

                break;
            case Animal.TYPE:

                this.motherNature.removeAnimal(entity);

                break;
        }

        for(let i = 0; i < this.zOrdered.length; i ++) {

            if (this.zOrdered[i] === entity) {

                this.zOrdered.splice(i, 1);
                break;

            }

        }

        this.lighting.removeEmitter(entity);

        if (entity.light) {

            entity.light.destroy();

        }

        entity.destroy();

    }.bind(this));

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
