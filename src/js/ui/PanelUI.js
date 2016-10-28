import PIXI from 'pixi.js';

import Layout from '../Layout';

export default class PanelUI extends PIXI.Container {

    constructor(world, id) {

        super();

        this.world = world;

        this.id = id;

        this.hit = new PIXI.Graphics();
        this.hit.beginFill(0x000000, .15);
        this.hit.drawRect(0, 0, Layout.WIDTH, Layout.HEIGHT);
        this.hit.endFill();

        this.hit.interactive = true;
        this.hit.on('mousedown', this.onButtonDown.bind(this));
        this.hit.on('touchstart', this.onButtonDown.bind(this));

        this.addChild(this.hit);

        let backgroundW = Layout.WIDTH * .8;
        let backgroundH = Layout.HEIGHT * .8;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 1);
        this.background.drawRect(0, 0, backgroundW, backgroundH);
        this.background.endFill();

        this.background.x = Layout.WIDTH * .5 - backgroundW * .5;
        this.background.y = Layout.HEIGHT * .5 - backgroundH * .5;

        this.addChild(this.background);

        this.toggle(false);

    }

    onButtonDown(event) {

        this.toggle(undefined, true);

    }

    toggle(show, dispatchEvent) {

        let isVisible;
        if (typeof(show) === 'undefined') {
            isVisible = !this.shown;
        } else {
            isVisible = show;
        }

        dispatchEvent = typeof(dispatchEvent) === 'undefined' ? false : dispatchEvent;

        this.visible = this.shown = isVisible;

        if (dispatchEvent) {

            this.emit(isVisible ? 'toggle:on' : 'toggle:off', this.id);

        }

    }

}
