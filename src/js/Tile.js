import PIXI from 'pixi.js';

export default function Tile() {

    this.type = Math.random() > .2 ? Tile.TYPE_GRASS : Tile.TYPE_WATER;
    this.type = Tile.TYPE_GRASS;

    this.canvas = document.createElement('canvas');
    this.canvas.width = Tile.WIDTH;
    this.canvas.height = Tile.HEIGHT;

    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.getColourFromType();
    // ctx.lineStyle(1, 0xFFFFFF, .1);
    ctx.fillRect(0, 0, Tile.WIDTH, Tile.HEIGHT);

}

Tile.prototype.getColourFromType = function() {

    return Tile.TILE_COLOURS[this.type] || '#FF0000';

}

Tile.WIDTH = 20;
Tile.HEIGHT = 20;

Tile.TYPE_WATER = 'water';
Tile.TYPE_GRASS = 'grass';

Tile.TILE_COLOURS = {
    water: '#000033',
    grass: '#002200'
};
