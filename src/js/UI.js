import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import Layout from './Layout';
import PanelController from './PanelController';

export default function UI(world) {

    PIXI.Container.call(this);

    this.supply = new SupplyUI(world);
    this.addChild(this.supply);

    this.time = new TimeUI(world);
    this.time.y =  50;
    this.addChild(this.time);

    this.panelController = new PanelController();

    this.building = new BuildingUI(world);
    this.addChild(this.building);

    this.log = new LogUI(world);
    this.addChild(this.log);

    this.panelController.add(this.building);
    this.panelController.add(this.log);

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

SupplyUI.constructor = SupplyUI;
SupplyUI.prototype = Object.create(PIXI.Container.prototype);

SupplyUI.prototype.update = function(wood, stone) {

    // console.log('Supply.update(', 'WOOD:' + this.wood, 'ROCK:' + this.stone, ')');

    this.text.text = 'Wood: ' + wood + ' | Stone: ' + stone;


    let w = this.text.width + 20;
    let h = this.text.height + 20;

    this.background.clear()
    this.background.beginFill(0x000000, .5);
    this.background.drawRect(0, 0, w, h);
    this.background.endFill();

}

/* -------------- */
/* --------- Time */
/* -------------- */


export function TimeUI() {

    PIXI.Container.call(this);

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

    this.text = new PIXI.Text('Time', style);
    this.text.x = 10;
    this.text.y = 10;
    this.addChild(this.text);

    this.update(0, 0);

}

TimeUI.constructor = TimeUI;
TimeUI.prototype = Object.create(PIXI.Container.prototype);

TimeUI.prototype.update = function(hour, minute) {

    this.text.text = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute);

    let w = this.text.width + 20;
    let h = this.text.height + 20;

    this.background.clear()
    this.background.beginFill(0x000000, .5);
    this.background.drawRect(0, 0, w, h);
    this.background.endFill();

}

/* -------------- */
/* ----- Building */
/* -------------- */

export function BuildingUI(world) {

    PIXI.Container.call(this);

    this.world = world;

    this.id = 'building';

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
    this.button.y = Layout.HEIGHT - buttonH;

    this.button.interactive = true;

    this.button.on('mousedown', this.onButtonDown.bind(this));
    this.button.on('touchstart', this.onButtonDown.bind(this));

    this.addChild(this.button);

    // Menu

    let menuW = Layout.WIDTH * .8;
    let menuH = Layout.HEIGHT * .8;

    this.menu = new PIXI.Graphics();
    this.menu.beginFill(0x000000, .5);
    this.menu.drawRect(0, 0, menuW, menuH);
    this.menu.endFill();

    this.menu.x = Layout.WIDTH * .5 - menuW * .5;
    this.menu.y = Layout.HEIGHT * .5 - menuH * .5;

    this.addChild(this.menu);

    // Buildings

    this.archetypeButtonsMap = {};

    world.buildings.archetypes.forEach(function(archetype, index) {

        let archetypeButtonW = 300;
        let archetypeButtonH = 60;

        let archetypeButton = new PIXI.Graphics();

        archetypeButton.archetype = archetype;

        archetypeButton.beginFill(0x000000, 1);
        archetypeButton.drawRect(0, 0, archetypeButtonW, archetypeButtonH);
        archetypeButton.endFill();

        archetypeButton.interactive = true;

        archetypeButton.on('mousedown', this.onArchetypeButtonDown.bind(this));
        archetypeButton.on('touchstart', this.onArchetypeButtonDown.bind(this));

        archetypeButton.x = 10;
        archetypeButton.y = 10 + (10 + archetypeButtonH) * index;

        this.archetypeButtonsMap[archetype.id] = archetypeButton;

        this.menu.addChild(archetypeButton);

        var style = {
            font : '16px Arial',
            fill : '#FFFFFF',
            wordWrap : true,
            wordWrapWidth : archetypeButtonW - 20
        };

        let textTitle = new PIXI.Text(archetype.title, style);
        textTitle.x = 10;
        textTitle.y = 10;
        archetypeButton.addChild(textTitle);

        style.font = '12px Arial';

        let textDescription = new PIXI.Text(archetype.description + ' (' + archetype.cWood + ' wood : ' + archetype.cStone + ' stone)', style);
        textDescription.x = 10;
        textDescription.y = 30;
        textDescription.alpha = .75;
        archetypeButton.addChild(textDescription);

    }.bind(this));

    this.toggle(false);

}

BuildingUI.constructor = BuildingUI;
BuildingUI.prototype = Object.create(PIXI.Container.prototype);

BuildingUI.prototype.onButtonDown = function(event) {

    this.toggle();

}

BuildingUI.prototype.onArchetypeButtonDown = function(event) {

    // Wait for drag start

    this.world.viewport.disable();

    this.world.interactive = true;
    this.dragging = false;
    this.activeArchetype = event.target.archetype;
    this.dragStartPos = event.data.getLocalPosition(this.world);

    this.onDragBound = this.onDrag.bind(this);
    this.onDragEndBound = this.onDragEnd.bind(this);

    this.world.on('mousemove', this.onDragBound);
    this.world.on('touchmove', this.onDragBound);

    this.world.on('mouseupoutside', this.onDragEndBound);
    this.world.on('mouseup', this.onDragEndBound);
    this.world.on('touchendoutside', this.onDragEndBound);
    this.world.on('touchend', this.onDragEndBound);


    // On drag start hide menu

    // Bind up listener on route

    // Show building placement

    // On Up Show confirm menu

    // On confirm place building

    // On cancel open building menu
}

BuildingUI.prototype.onDragStart = function(event) {

    this.dragging = true;

    this.toggle(false);

    let pos = event.data.getLocalPosition(this.world);

    this.activeBuilding = new this.activeArchetype.c(this.world, pos.x, pos.y, true);
    this.activeBuilding.x = pos.x;
    this.activeBuilding.y = pos.y;

    this.world.content.addChild(this.activeBuilding);



}

BuildingUI.prototype.onDrag = function(event) {

    let distanceFromStart = Maths.distanceBetween(this.dragStartPos, event.data.getLocalPosition(this.world));

    if (!this.dragging && distanceFromStart > 5) {

        this.onDragStart(event);

    } else if (this.dragging) {

        let pos = event.data.getLocalPosition(this.world);
        let tile = this.world.getTileFromWorld(pos.x, pos.y + this.world.viewport.scroll);
        if (tile && !tile.isOccupied) {

            this.activeBuilding.x = tile.xCentre;
            this.activeBuilding.y = tile.yCentre;

        }

    }

}

BuildingUI.prototype.onDragEnd = function() {

    this.world.off('mousemove', this.onDragBound);
    this.world.off('touchmove', this.onDragBound);

    this.world.off('mouseupoutside', this.onDragEndBound);
    this.world.off('mouseup', this.onDragEndBound);
    this.world.off('touchendoutside', this.onDragEndBound);
    this.world.off('touchend', this.onDragEndBound);

    if (this.dragging) {

        let targetX = this.activeBuilding.x;
        let targetY = this.activeBuilding.y;

        let targetTile = this.world.getTileFromWorld(targetX, targetY);

        if (targetTile && !targetTile.isOccupied) {

            let canAfford = this.world.supply.wood.get() >= this.activeArchetype.cWood && this.world.supply.stone.get() >= this.activeArchetype.cStone;

            if (canAfford && window.confirm('Place new ' + this.activeArchetype.title + ' at ' + targetTile.tileX + '/' + targetTile.tileY + '?')) {

                // console.log('Placing new', this.activeArchetype.title, 'at', targetTile.tileX + '/' + targetTile.tileY);

                this.world.supply.wood.decrement(this.activeArchetype.cWood);
                this.world.supply.stone.decrement(this.activeArchetype.cStone);

                this.world.addBuilding(this.activeArchetype.id, targetTile.tileX, targetTile.tileY);

            } else {

                this.toggle(true);

            }

        }

        this.world.removeChild(this.activeBuilding);
        this.activeBuilding.destroy();
        this.activeBuilding = null;

        this.activeArchetype = false;

    }

    this.dragStartPos = false;

    this.world.viewport.enable();

    if (!this.world.viewport.isInteractive) {

        this.world.interactive = false;

    }

}

BuildingUI.prototype.toggle = function(show, dispatchEvent) {

    let isVisible;
    if (typeof(show) === 'undefined') {
        isVisible = !this.shown;
    } else {
        isVisible = show;
    }

    dispatchEvent = typeof(dispatchEvent) === 'undefined' ? true : dispatchEvent;

    this.menu.visible = this.shown = isVisible;

    if (dispatchEvent) {

        this.emit(isVisible ? 'toggle:on' : 'toggle:off', this.id);

    }

}

BuildingUI.prototype.update = function(wood, stone) {

    this.world.buildings.archetypes.forEach(function(archetype) {

        let canAfford = archetype.cWood <= wood && archetype.cStone <= stone;

        let button = this.archetypeButtonsMap[archetype.id];

        button.alpha = canAfford ? 1 : .5;
        button.interactive = canAfford;

    }.bind(this));

}

/* -------------- */
/* ---------- Log */
/* -------------- */

export function LogUI(world) {

    PIXI.Container.call(this);

    this.world = world;

    this.id = 'log';

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

    this.addChild(this.button);

    // Log

    let logW = Layout.WIDTH * .8;
    let logH = Layout.HEIGHT * .8;

    this.logStyle = {
        font : '14px Arial',
        fill : '#FFFFFF'
    };

    this.logContainer = new PIXI.Graphics();
    this.logContainer.beginFill(0x000000, .5);
    this.logContainer.drawRect(0, 0, logW, logH);
    this.logContainer.endFill();

    this.logContainer.x = Layout.WIDTH * .5 - logW * .5;
    this.logContainer.y = Layout.HEIGHT * .5 - logH * .5;

    this.addChild(this.logContainer);

    this.logItems = new PIXI.Container();
    this.logContainer.addChild(this.logItems);

    this.logItemHeight = 24;
    this.logItemY = 0;

    this.logCount = 0;
    this.logMax = Math.floor((logH - 40) / this.logItemHeight);

    this.toggle(false);

}

LogUI.constructor = LogUI;
LogUI.prototype = Object.create(PIXI.Container.prototype);

LogUI.prototype.log = function(message) {

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

LogUI.prototype.onButtonDown = function(event) {

    this.toggle(undefined, true);

}

LogUI.prototype.toggle = function(show, dispatchEvent) {

    let isVisible;
    if (typeof(show) === 'undefined') {
        isVisible = !this.shown;
    } else {
        isVisible = show;
    }

    dispatchEvent = typeof(dispatchEvent) === 'undefined' ? false : dispatchEvent;

    this.logContainer.visible = this.shown = isVisible;

    if (dispatchEvent) {

        this.emit(isVisible ? 'toggle:on' : 'toggle:off', this.id);

    }

}
