import PIXI from 'pixi.js';

export default function ValueBarUI(w, h, value) {

    PIXI.Container.call(this);

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x333333);
    this.background.drawRect(0, 0, w, h);
    this.background.endFill();
    this.background.beginFill(0xBB3333);
    this.background.drawRect(1, 1, w - 2, h - 2);
    this.background.endFill();
    this.addChild(this.background);

    this.bar = new PIXI.Graphics();
    this.bar.x = 1;
    this.bar.y = 1;
    this.bar.beginFill(0x33BB33);
    this.bar.drawRect(0, 0, w - 2, h - 2);
    this.bar.endFill();
    this.addChild(this.bar);

    this.setValue(value || 0)

}

ValueBarUI.constructor = ValueBarUI;
ValueBarUI.prototype = Object.create(PIXI.Container.prototype);

ValueBarUI.prototype.setValue = function(value) {

    this.bar.scale.x = value;

}
