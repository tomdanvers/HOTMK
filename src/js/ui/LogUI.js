import * as PIXI from 'pixi.js';

import Layout from '../Layout';

import PanelUI from './PanelUI';

export default class LogUI extends PanelUI {

    constructor(world) {

        super(world, 'log');

        // Toggle Button

        let buttonW = 60;
        let buttonH = 60;

        this.button = new PIXI.Graphics();
        this.button.beginFill(0x000000, .5);
        this.button.drawRect(0, 0, buttonW, buttonH);
        this.button.endFill();

        this.button.beginFill(0xFFFFFF, .75);
        this.button.drawRect(10, 10, buttonW - 20, buttonH - 20);
        this.button.endFill();

        this.button.x = Layout.WIDTH - buttonW;
        this.button.y = Layout.HEIGHT - buttonH * 2 - 20;

        this.button.interactive = true;

        this.button.on('mousedown', this.onButtonDown.bind(this));
        this.button.on('touchstart', this.onButtonDown.bind(this));

        // Log

        let logW = Layout.WIDTH * .8;
        let logH = Layout.HEIGHT * .8;

        this.logStyle = {
            font : '14px Arial',
            fill : '#FFFFFF'
        };

        this.logItems = new PIXI.Container();
        this.background.addChild(this.logItems);

        this.logItemHeight = 24;
        this.logItemY = 0;

        this.logCount = 0;
        this.logMax = Math.floor((logH - 40) / this.logItemHeight);

        this.toggle(false);

    }

    log(message) {

        let item = new PIXI.Text(message, this.logStyle);
        item.x = 20;
        item.y = this.logItemY;
        this.logItems.addChild(item);

        this.logItems.y += this.logItemHeight;
        this.logItemY -= this.logItemHeight;

        this.logCount ++;

        if (this.logCount > this.logMax) {

            this.logItems.getChildAt(0).destroy();

            this.logCount --;
        }

    }

    onButtonDown(event) {

        this.toggle(undefined, true);

    }

}
