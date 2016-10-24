import PIXI from 'pixi.js';

import Maths from './utils/Maths';

export default function Viewport(world, width, height, worldWidth, worldHeight, isInteractive) {

    this.world = world;

    this.width = width;
    this.height = height;

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.scroll = this.worldHeight - this.height;
    // this.scroll = 0;

    this.scrollTarget = this.scroll;

    this.isEnabled = true;
    this.isInteractive = false;//isInteractive;

    if (this.isInteractive) {

        this.dragging = false;
        this.world.interactive = true;
        this.world.on('mousedown', this.onWorldDown.bind(this));
        this.world.on('touchstart', this.onWorldDown.bind(this));

    }

}

Viewport.constructor = Viewport;

Viewport.prototype.update = function(timeDelta, world) {


    if (this.scrollTarget > this.worldHeight - this.height) {

        this.scrollTarget = this.worldHeight - this.height;

    } else if (this.scrollTarget < 0) {

        this.scrollTarget = 0;

    }

    this.scroll += (this.scrollTarget - this.scroll) * .5;

}

Viewport.prototype.onWorldDown = function(event) {

    this.dragging = false;
    this.dragStartPos = event.data.getLocalPosition(this.world);
    this.lastY = this.dragStartPos.y;

    if (this.isEnabled) {

        this.world.on('mousemove', this.onDrag.bind(this));
        this.world.on('touchmove', this.onDrag.bind(this));

        this.world.on('mouseupoutside', this.onDragEnd.bind(this));
        this.world.on('mouseup', this.onDragEnd.bind(this));
        this.world.on('touchendoutside', this.onDragEnd.bind(this));
        this.world.on('touchend', this.onDragEnd.bind(this));

    }


}

Viewport.prototype.onDragStart = function(event) {

    this.dragging = true;

    // let pos = event.data.getLocalPosition(this.world);

}

Viewport.prototype.onDrag = function(event) {

    let distanceFromStart = Maths.distanceBetween(this.dragStartPos, event.data.getLocalPosition(this.world));

    if (!this.dragging && distanceFromStart > 5) {

        this.onDragStart(event);

    } else if (this.dragging) {

        let pos = event.data.getLocalPosition(this.world);

        let diffY = this.lastY - pos.y;

        this.scrollTarget += diffY;

        this.lastY = pos.y;

    }

}

Viewport.prototype.onDragEnd = function() {

    if (this.dragging) {



    }

    this.dragStartPos = false;
    this.dragging = false;

    this.world.off('mousemove');
    this.world.off('touchmove');

    this.world.off('mouseupoutside');
    this.world.off('mouseup');
    this.world.off('touchendoutside');
    this.world.off('touchend');

}

Viewport.prototype.enable = function() {

    this.isEnabled = true;

}

Viewport.prototype.disable = function() {

    this.isEnabled = false;

}
