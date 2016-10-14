import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import Layout from './Layout';
import PanelController from './PanelController';
import ValueBarUI from './ui/ValueBarUI';

export default function UI(world) {

    PIXI.Container.call(this);

    this.supply = new SupplyUI(world);
    this.addChild(this.supply);

    this.time = new TimeUI(world);
    this.time.y =  50;
    this.addChild(this.time);

    this.panelController = new PanelController();

    this.panelButtons = new PIXI.Container();
    this.addChild(this.panelButtons);

    this.construction = new ConstructionUI(world);
    this.addChild(this.construction);

    this.log = new LogUI(world);
    this.addChild(this.log);

    this.panelButtons.addChild(this.construction.button);
    this.panelButtons.addChild(this.log.button);

    this.building = new BuildingUI(world);
    this.addChild(this.building);

    this.panelController.add(this.building);
    this.panelController.add(this.construction);
    this.panelController.add(this.log);

}

UI.constructor = UI;
UI.prototype = Object.create(PIXI.Container.prototype);

UI.prototype.update = function(timeDelta, world) {

    this.building.update(timeDelta, world);

}

UI.prototype.updateSupply = function(wood, stone) {

    this.supply.update(wood, stone);
    this.construction.update(wood, stone);

}

/* ---------------------------- */
/* ---------------------- Panel */
/* ---------------------------- */

export function PanelUI(world, id) {

    PIXI.Container.call(this);

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

PanelUI.constructor = PanelUI;
PanelUI.prototype = Object.create(PIXI.Container.prototype);

PanelUI.prototype.onButtonDown = function(event) {

    this.toggle(undefined, true);

}

PanelUI.prototype.toggle = function(show, dispatchEvent) {

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



/* ---------------------------- */
/* ------------------- Building */
/* ---------------------------- */

export function BuildingUI(world) {

    PanelUI.call(this, world, 'building');

    var style = {
        font : '20px Arial',
        fill : '#FFFFFF',
        wordWrap : true,
        wordWrapWidth : this.background.width - 40
    };

    this.textTitle = new PIXI.Text('title', style);
    this.textTitle.x = 20;
    this.textTitle.y = 20;
    this.background.addChild(this.textTitle);

    style.font = '14px Arial';

    this.textDescription = new PIXI.Text('description', style);
    this.textDescription.x = 20;
    this.textDescription.y = 50;
    this.textDescription.alpha = .75;
    this.background.addChild(this.textDescription);

    this.integrity = new ValueBarUI(this.background.width - 40, 10);
    this.integrity.x = 20;
    this.integrity.y = this.background.height - 30;
    this.background.addChild(this.integrity);

}

BuildingUI.constructor = BuildingUI;
BuildingUI.prototype = Object.create(PanelUI.prototype);

BuildingUI.prototype.update = function(timeDelta, world) {

    if (this.shown && this.activeBuilding) {

        this.integrity.setValue(this.activeBuilding.integrity.val());

    }

}

BuildingUI.prototype.setBuilding = function(building) {

    this.activeBuilding = building;

    this.textTitle.setText(building.archetype.title);
    this.textDescription.setText(building.archetype.description);
    this.integrity.setValue(building.integrity.val());

}


/* ---------------------------- */
/* --------------------- Supply */
/* ---------------------------- */

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


/* ---------------------------- */
/* ----------------------- Time */
/* ---------------------------- */

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


/* ---------------------------- */
/* --------------- Construction */
/* ---------------------------- */

export function ConstructionUI(world) {

    PanelUI.call(this, world, 'construction');

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

    // Buildings

    this.archetypeButtonsMap = {};

    world.buildings.archetypes.forEach(function(archetype, index) {

        let archetypeButtonW = Math.min(300, this.background.width - 40);
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

        this.background.addChild(archetypeButton);

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

}

ConstructionUI.constructor = ConstructionUI;
ConstructionUI.prototype = Object.create(PanelUI.prototype);

ConstructionUI.prototype.onButtonDown = function(event) {

    this.toggle();

}

ConstructionUI.prototype.onArchetypeButtonDown = function(event) {

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

ConstructionUI.prototype.onDragStart = function(event) {

    this.dragging = true;

    this.toggle(false);

    let pos = event.data.getLocalPosition(this.world);

    this.activeBuilding = new this.activeArchetype.c(this.world, pos.x, pos.y, this.activeArchetype, true);
    this.activeBuilding.x = pos.x;
    this.activeBuilding.y = pos.y;

    this.world.content.addChild(this.activeBuilding);



}

ConstructionUI.prototype.onDrag = function(event) {

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

ConstructionUI.prototype.onDragEnd = function() {

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

ConstructionUI.prototype.update = function(wood, stone) {

    this.world.buildings.archetypes.forEach(function(archetype) {

        let canAfford = archetype.cWood <= wood && archetype.cStone <= stone;

        let button = this.archetypeButtonsMap[archetype.id];

        button.alpha = canAfford ? 1 : .5;
        button.interactive = canAfford;

    }.bind(this));

}


/* ---------------------------- */
/* ------------------------ Log */
/* ---------------------------- */

export function LogUI(world) {

    PanelUI.call(this, world, 'log');

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

LogUI.constructor = LogUI;
LogUI.prototype = Object.create(PanelUI.prototype);

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
