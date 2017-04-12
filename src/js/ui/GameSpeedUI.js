import * as PIXI from 'pixi.js';

import World from '../World';
import Layout from '../Layout';

export default class GameSpeedUI extends PIXI.Container {

    constructor(world) {

        super();

        this.world = world;

        this.buttonW = 40;
        this.buttonH = 40;

        this.button = new PIXI.Graphics();
        this.button.beginFill(0x000000, .5);
        this.button.drawRect(0, 0, this.buttonW, this.buttonH);
        this.button.endFill();

        this.button.x = Layout.WIDTH - this.buttonW;
        this.button.y = 0;

        this.button.interactive = true;

        this.button.on('mousedown', this.onButtonDown.bind(this));
        this.button.on('touchstart', this.onButtonDown.bind(this));

        this.addChild(this.button);

        var style = {
            font : '16px Arial',
            fill : '#FFFFFF'
        };

        this.text = new PIXI.Text('x1', style);
        this.text.y = 10;
        this.button.addChild(this.text);

        this.speedIndex = 0;
        this.speeds = [1, 2, 4];

        this.updateButton();

    }

    onButtonDown(event) {

        this.speedIndex ++;

        if (this.speedIndex >= this.speeds.length) {

            this.speedIndex = 0;

        }

        this.updateButton();

    }

    updateButton() {

        let speed = this.speeds[this.speedIndex];

        this.text.text = 'x' + speed;
        this.text.x = (this.buttonW - this.text.width) * .5;

        World.TICK_RATE = speed;

    }

}
