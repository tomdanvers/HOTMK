import PIXI from 'pixi.js';

import Tile from './Tile';

import Tree from './Tree';

import Rock from './Rock';

import Supply from './Supply';

import Barracks from './Barracks';

import Dwarf from './Dwarf';

import UI from './UI';

import Layout from './Layout';

export default function World() {

    PIXI.Container.call(this);

    World.WIDTH = Math.ceil(Layout.WIDTH / Tile.WIDTH);
    World.HEIGHT = Math.ceil(Layout.HEIGHT / Tile.HEIGHT);

    this.timeOfLastUpdate = 0;

    this.supply = new Supply();

    this.tiles = [];
    this.resources = [];
    this.trees = [];
    this.rocks = [];
    this.zOrdered = [];

    // this.containerTiles = new PIXI.Container();
    this.containerZOrdered = new PIXI.Container();

    this.ui = new UI();

    let background = document.createElement('canvas');
    background.width = World.WIDTH * Tile.WIDTH;
    background.height = World.HEIGHT * Tile.HEIGHT;

    let backgroundCtx = background.getContext('2d');

    for (let x = 0; x < World.WIDTH; x ++) {

        for (let y = 0; y < World.HEIGHT; y ++) {

            let tile = this.addTile(x, y);

            backgroundCtx.drawImage(tile.canvas, x * Tile.WIDTH, y * Tile.HEIGHT);

            if (tile.type === Tile.TYPE_GRASS && Math.random() > .9) {

                let tree = this.addTree(x, y);

            } else if (tile.type === Tile.TYPE_GRASS && Math.random() > .99) {

                let rock = this.addRock(x, y);

            }

        }

    }

    this.background = new PIXI.Sprite(PIXI.Texture.fromCanvas(background));
    this.addChild(this.background);
    this.addChild(this.containerZOrdered);
    this.addChild(this.ui);

    // this.containerTiles.visible = false;

    this.buildings = [];

    this.addBuilding(World.WIDTH * .5 * Tile.WIDTH, World.HEIGHT * .5 * Tile.HEIGHT);
    this.addBuilding(World.WIDTH * .25 * Tile.WIDTH, World.HEIGHT * .15 * Tile.HEIGHT);

    this.dwarves = [];

    this.addDwarf(World.WIDTH * .5 * Tile.WIDTH - 25, World.HEIGHT * .5 * Tile.HEIGHT, Dwarf.ROLE_BUILDER);

}

World.constructor = World;
World.prototype = Object.create(PIXI.Container.prototype);

World.prototype.addTile = function(x, y) {

    let tile = new Tile();
    tile.x = x * Tile.WIDTH;
    tile.y = y * Tile.HEIGHT;

    this.tiles.push(tile);
    // this.containerTiles.addChild(tile);

    return tile;

}

World.prototype.addTree = function(x, y) {

    let tree = new Tree();
    tree.x = x * Tile.WIDTH + Tile.WIDTH * .5;
    tree.y = y * Tile.HEIGHT + Tile.HEIGHT * .5;

    this.resources.push(tree);
    this.trees.push(tree);
    this.zOrdered.push(tree);

    this.containerZOrdered.addChild(tree);

    return tree;

}

World.prototype.addRock = function(x, y) {

    let rock = new Rock();
    rock.x = x * Tile.WIDTH + Tile.WIDTH * .5;
    rock.y = y * Tile.HEIGHT + Tile.HEIGHT * .5;

    this.resources.push(rock);
    this.rocks.push(rock);
    this.zOrdered.push(rock);

    this.containerZOrdered.addChild(rock);

    return rock;

}

World.prototype.addBuilding = function(x, y) {

    let building = new Barracks(this);
    building.x = x + Tile.WIDTH * .5;
    building.y = y + Tile.HEIGHT * .5;

    this.buildings.push(building);
    this.zOrdered.push(building);

    this.containerZOrdered.addChild(building);

}

World.prototype.addDwarf = function(x, y, role) {

    let dwarf = new Dwarf(this, x, y, role || Dwarf.ROLE_IDLE);

    this.dwarves.push(dwarf);
    this.zOrdered.push(dwarf);

    this.containerZOrdered.addChild(dwarf);

}

World.prototype.update = function(time) {

    let timeDelta = time - this.timeOfLastUpdate;

    this.timeOfLastUpdate = time;

    this.tiles.forEach(function(tile) {
        // tile.rotation += 0.1;
    });

    this.dwarves.forEach(function(dwarf) {

        dwarf.update(timeDelta, this);

    }.bind(this));

    this.resources.forEach(function(resource) {

        resource.update(timeDelta, this);

    }.bind(this));

    this.buildings.forEach(function(building) {

        building.update(timeDelta, this);

    }.bind(this));

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

World.WIDTH = 48;
World.HEIGHT = 32;
