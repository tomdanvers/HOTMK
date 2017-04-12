import * as PIXI from 'pixi.js';

import Layout from '../Layout';

export default class DayUI extends PIXI.Container {

    constructor() {

        super();

        let w = 280;
        let h = 40;

        var style = {
            font : '52px Arial',
            fill : '#FFFFFF'
        };

        this.text = new PIXI.Text('Day Count', style);
        this.addChild(this.text);

        this.visible = false;

    }

    dayChanged(day) {

        this.text.text = 'Day ' + day;

        let w = this.text.width;
        let h = this.text.height;

        this.text.x = (Layout.WIDTH - w) * .5;
        this.text.y = (Layout.HEIGHT - h) * .5;

        this.visible = true;
        this.alpha = 1;

    }

    update(timeDelta, world) {

        if (this.visible) {

            this.alpha -= .03;

            if (this.alpha <= 0) {

                this.visible = false;

            }

        }

    }

}
