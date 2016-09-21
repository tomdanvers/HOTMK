import PIXI from 'pixi.js';

export default function Viewport(width, height, worldWidth, worldHeight) {


    this.width = width;
    this.height = height;

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.scroll = this.worldHeight - this.height;
    this.scroll = 0;

}

Viewport.constructor = Viewport;

Viewport.prototype.update = function(timeDelta, world) {

    let newScroll = this.scroll + 1;

    if (newScroll <= this.worldHeight - this.height && newScroll > 0) {

        this.scroll = newScroll;

    }

}
