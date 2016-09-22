import PIXI from 'pixi.js';

import World from './World';
import Tile from './Tile';

export default function Lighting(world) {

    PIXI.Sprite.call(this);

    this.lightCanvas = document.createElement('canvas');
    this.lightCtx = this.lightCanvas.getContext('2d');

    this.shadowCanvas = document.createElement('canvas');
    this.shadowCanvas.width = World.WIDTH * Tile.WIDTH;
    this.shadowCanvas.height = World.HEIGHT * Tile.HEIGHT;

    this.shadowCtx = this.shadowCanvas.getContext('2d');

    this.staticCanvas = document.createElement('canvas');
    this.staticCanvas.width = World.WIDTH * Tile.WIDTH;
    this.staticCanvas.height = World.HEIGHT * Tile.HEIGHT;

    this.staticCtx = this.staticCanvas.getContext('2d');

    this.emitters = [];

}

Lighting.constructor = Lighting;
Lighting.prototype = Object.create(PIXI.Sprite.prototype);

Lighting.VERBOSE = true;

Lighting.prototype.addStatic = function(x, y, radius, xOffset, yOffset) {

    if (Lighting.VERBOSE) {

        console.log('Lighting.addStatic(',x, y, radius, xOffset, yOffset,')');

    }

    let gradient = this.shadowCtx.createRadialGradient(x + xOffset, y + yOffset, 0, x + xOffset, y + yOffset, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(.4, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.staticCtx.fillStyle = gradient;
    this.staticCtx.beginPath();
    this.staticCtx.arc(x + xOffset, y + yOffset, radius, 0, 2 * Math.PI);
    this.staticCtx.fill();

    return this.createLight(radius, xOffset, yOffset);

}

Lighting.prototype.addEmitter = function(owner, radius, xOffset, yOffset) {

    let canvas = document.createElement('canvas');
    canvas.width = radius * 2;
    canvas.height = radius * 2;

    let ctx = canvas.getContext('2d');

    let gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(.4, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.fill();

    let emitter = {
        owner,
        radius,
        canvas,
        xOffset,
        yOffset
    };

    this.emitters.push(emitter);

    if (Lighting.VERBOSE) {

        console.log('Lighting.addEmitter(',owner, radius, xOffset, yOffset,')');

    }

    return this.createLight(radius, xOffset, yOffset);

}

Lighting.prototype.createLight = function(radius, xOffset, yOffset) {

    let canvas = document.createElement('canvas');

    canvas.width = canvas.height = radius * 2;

    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lightGradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    lightGradient.addColorStop(0, 'rgba(250, 224, 77, .15)');
    lightGradient.addColorStop(.6, 'rgba(250, 224, 77, .15)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.fill();

    let light = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
    light.alpha = 0;
    light.radius = radius;
    light.xOffset = xOffset;
    light.yOffset = yOffset;
    light.blendMode = PIXI.BLEND_MODES.SCREEN;

    return light;

}

Lighting.prototype.update = function(timeDelta, world) {

    if (world.timeOfDay.getSunValue() > 0) {

        let width = World.WIDTH * Tile.WIDTH;
        let height = World.HEIGHT * Tile.HEIGHT;

        this.shadowCtx.clearRect(0, 0, width, height);

        this.shadowCtx.fillStyle = 'rgba(0, 0, 0, .7)';
        this.shadowCtx.fillRect(0, 0, width, height)

        this.shadowCtx.globalCompositeOperation = 'destination-out';

        this.shadowCtx.drawImage(this.staticCanvas, 0, 0);

        this.emitters.forEach(function(emitter) {

            this.shadowCtx.drawImage(emitter.canvas, emitter.owner.x - emitter.radius + emitter.xOffset, emitter.owner.y - emitter.radius + emitter.yOffset);

        }.bind(this));

        this.shadowCtx.globalCompositeOperation = 'source-over';

        this.texture = PIXI.Texture.fromCanvas(this.shadowCanvas);
        this.texture.update();

    }

    this.alpha = world.timeOfDay.getSunValue();


}
