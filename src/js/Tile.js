import * as PIXI from 'pixi.js';

export default class Tile {

    constructor(x, y, elevation) {

        this.type = Math.random() > .2 ? Tile.TYPE_GRASS : Tile.TYPE_WATER;
        this.type = Tile.TYPE_GRASS;

        this.elevation = (elevation + 1) * .5;

        this.tileX = x;
        this.tileY = y;

        this.x = x * Tile.WIDTH;
        this.y = y * Tile.HEIGHT;

        this.xCentre = this.x + Tile.WIDTH * .5;
        this.yCentre = this.y + Tile.HEIGHT * .5;

        this.isOccupied = false;

        this.canvas = document.createElement('canvas');
        this.canvas.width = Tile.WIDTH;
        this.canvas.height = Tile.HEIGHT;

        let ctx = this.canvas.getContext('2d');

        ctx.fillStyle = this.getColourFromType();
        ctx.fillRect(0, 0, Tile.WIDTH, Tile.HEIGHT);

        ctx.fillStyle = 'rgba(0, 0, 0, ' + (1 - this.elevation) * .25 + ')';
        ctx.fillRect(0, 0, Tile.WIDTH, Tile.HEIGHT);

        ctx.fillStyle = 'rgba(255, 255, 255, .025)';
        ctx.fillRect(0, 0, 1, Tile.HEIGHT);
        ctx.fillRect(0, 0, Tile.WIDTH, 1);
        // ctx.strokeRect(0, 0, Tile.WIDTH, Tile.HEIGHT);

    }

    occupy() {

        this.isOccupied = true;

    }

    abandon() {

        this.isOccupied = false;

    }

    getColourFromType() {

        return Tile.TILE_COLOURS[this.type] || '#FF0000';

    }

}

Tile.WIDTH = 20;
Tile.HEIGHT = 20;

Tile.TYPE_WATER = 'water';
Tile.TYPE_GRASS = 'grass';

Tile.TILE_COLOURS = {
    water: '#000033',
    grass: '#002C00'
};
