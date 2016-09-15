import PIXI from 'pixi.js';
import Maths from './Maths';
import Layout from './Layout';

export default function UI() {

    PIXI.Container.call(this);

    this.supply = new SupplyUI();
    this.addChild(this.supply);

    this.building = new BuildingUI();
    this.addChild(this.building);


}

UI.constructor = UI;
UI.prototype = Object.create(PIXI.Container.prototype);


/* -------------- */
/* ------- Supply */
/* -------------- */


export function SupplyUI() {

    PIXI.Container.call(this);

    let w = 280;
    let h = 40;

    let base = new PIXI.Graphics();
    base.beginFill(0x000000, .5);
    base.drawRect(0, 0, w, h);
    base.endFill();
    this.addChild(base);

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

SupplyUI.constructor = SupplyUI;
SupplyUI.prototype = Object.create(PIXI.Container.prototype);

SupplyUI.prototype.update = function(wood, stone) {

    // console.log('Supply.update(', 'WOOD:' + this.wood, 'ROCK:' + this.stone, ')');

    this.text.text = 'Supply | Wood: ' + wood + ' | Stone: ' + stone;

}

/* -------------- */
/* ----- Building */
/* -------------- */

export function BuildingUI() {

    PIXI.Container.call(this);

    // Toggle Button

    let buttonW = 60;
    let buttonH = 60;

    this.button = new PIXI.Graphics();
    this.button.beginFill(0x000000, .5);
    this.button.drawRect(0, 0, buttonW, buttonH);
    this.button.endFill();

    this.button.x = Layout.WIDTH - buttonW;
    this.button.y = Layout.HEIGHT - buttonH;

    this.button.interactive = true;

    this.button.on('mousedown', this.onDown.bind(this));
    this.button.on('touchstart', this.onDown.bind(this));

    this.addChild(this.button);

    // Menu

    let menuW = 600;
    let menuH = 400;

    this.menu = new PIXI.Graphics();
    this.menu.beginFill(0x000000, .5);
    this.menu.drawRect(0, 0, menuW, menuH);
    this.menu.endFill();

    this.menu.x = Layout.WIDTH * .5 - menuW * .5;
    this.menu.y = Layout.HEIGHT * .5 - menuH * .5;

    this.addChild(this.menu);

    this.toggle(false);

}

BuildingUI.constructor = BuildingUI;
BuildingUI.prototype = Object.create(PIXI.Container.prototype);

BuildingUI.prototype.onDown = function(event) {

    this.toggle();

}

BuildingUI.prototype.toggle = function(show) {

    let newShow;
    if (typeof(show) === 'undefined') {
        newShow = !this.shown;
    } else {
        newShow = show;
    }

    this.menu.visible = this.shown = newShow;

}
