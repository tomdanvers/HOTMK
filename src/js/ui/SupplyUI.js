import * as PIXI from 'pixi.js';

export default class SupplyUI extends PIXI.Container {

    constructor() {

        super();

        let w = 280;
        let h = 40;

        this.background = new PIXI.Graphics();
        this.addChild(this.background);

        var style = {
            font : '16px Arial',
            fill : '#FFFFFF',
            wordWrap : true,
            wordWrapWidth : w - 20
        };

        this.text = new PIXI.Text('Supply', style);
        this.text.x = 10;
        this.text.y = 10;
        this.addChild(this.text);

        this.update(0, 0);

    }

    update(wood, stone) {

        this.text.text = 'Wood: ' + wood + ' | Stone: ' + stone;

        let w = this.text.width + 20;
        let h = this.text.height + 20;

        this.background.clear()
        this.background.beginFill(0x000000, .5);
        this.background.drawRect(0, 0, w, h);
        this.background.endFill();

    }

}
