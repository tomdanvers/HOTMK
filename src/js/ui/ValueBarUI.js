import PIXI from 'pixi.js';

export default function ValueBarUI(w, h, value) {

    PIXI.Container.call(this);

    w = Math.round(w);
    h = Math.round(h);

    let border = w >= 20 && h >= 20;

    console.log('border', border)

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x333333);
    this.background.drawRect(0, 0, w, h);
    this.background.endFill();
    this.background.beginFill(0xBB3333);
    if (border) {
        this.background.drawRect(1, 1, w - 2, h - 2);
    } else {
        this.background.drawRect(0, 0, w, h);
    }
    this.background.endFill();
    this.addChild(this.background);

    this.bar = new PIXI.Graphics();
    this.bar.beginFill(0x33BB33);
    if (border) {
        this.bar.drawRect(0, 0, w - 2, h - 2);
        this.bar.x = 1;
        this.bar.y = 1;
    } else {
        this.bar.drawRect(0, 0, w, h);
    }
    this.bar.endFill();
    this.addChild(this.bar);

    this.setValue(value || 0)

}

ValueBarUI.constructor = ValueBarUI;
ValueBarUI.prototype = Object.create(PIXI.Container.prototype);

ValueBarUI.prototype.setValue = function(value) {

    this.bar.scale.x = value;

}
