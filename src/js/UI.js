import PIXI from 'pixi.js';
import Maths from './Maths';
import Layout from './Layout';

export default function UI(world) {

    PIXI.Container.call(this);

    this.supply = new SupplyUI(world);
    this.addChild(this.supply);

    this.building = new BuildingUI(world);
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
/* ----- Building */
/* -------------- */

export function BuildingUI(world) {

    PIXI.Container.call(this);

    this.world = world;

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

        let archetypeButtonW = 200;
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

        let text = new PIXI.Text(archetype.title, style);
        text.x = 10;
        text.y = 10;
        archetypeButton.addChild(text);

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

    this.world.interactive = true;
    this.dragging = false;
    this.activeArchetype = event.target.archetype;
    this.dragStartPos = event.data.getLocalPosition(this.world);

    this.world.on('mousemove', this.onDrag.bind(this));
    this.world.on('touchmove', this.onDrag.bind(this));

    this.world.on('mouseupoutside', this.onDragEnd.bind(this));
    this.world.on('mouseup', this.onDragEnd.bind(this));
    this.world.on('touchendoutside', this.onDragEnd.bind(this));
    this.world.on('touchend', this.onDragEnd.bind(this));


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

    this.activeBuilding = new this.activeArchetype.c(this.world);
    this.activeBuilding.x = pos.x;
    this.activeBuilding.y = pos.y;

    this.world.addChild(this.activeBuilding);

}

BuildingUI.prototype.onDrag = function(event) {

    let distanceFromStart = Maths.distanceBetween(this.dragStartPos, event.data.getLocalPosition(this.world));

    if (!this.dragging && distanceFromStart > 5) {

        this.onDragStart(event);

    } else if (this.dragging) {

        let pos = event.data.getLocalPosition(this.world);
        let tile = this.world.getTileFromWorld(pos.x, pos.y);
        if (tile && !tile.isOccupied) {

            this.activeBuilding.x = tile.xCentre;
            this.activeBuilding.y = tile.yCentre;

        }

    }

}

BuildingUI.prototype.onDragEnd = function() {

    if (this.dragging) {

        let targetX = this.activeBuilding.x;
        let targetY = this.activeBuilding.y;

        let targetTile = this.world.getTileFromWorld(targetX, targetY);

        if (targetTile && !targetTile.isOccupied) {

            let canAfford = this.world.supply.wood >= this.activeArchetype.cWood && this.world.supply.stone >= this.activeArchetype.cStone;

            if (canAfford && window.confirm('Place new ' + this.activeArchetype.title + ' at ' + targetTile.tileX + '/' + targetTile.tileY + '?')) {

                console.log('Placing new', this.activeArchetype.title, 'at', targetTile.tileX + '/' + targetTile.tileY);

                this.world.supply.wood -= this.activeArchetype.cWood;
                this.world.supply.stone -= this.activeArchetype.cStone;

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

    this.world.interactive = false;

    this.world.off('mousemove');
    this.world.off('touchmove');

    this.world.off('mouseupoutside');
    this.world.off('mouseup');
    this.world.off('touchendoutside');
    this.world.off('touchend');

}

BuildingUI.prototype.toggle = function(show) {

    let isVisible;
    if (typeof(show) === 'undefined') {
        isVisible = !this.shown;
    } else {
        isVisible = show;
    }

    this.menu.visible = this.shown = isVisible;

}

BuildingUI.prototype.update = function(wood, stone) {

    this.world.buildings.archetypes.forEach(function(archetype) {

        let canAfford = archetype.cWood <= wood && archetype.cStone <= stone;

        let button = this.archetypeButtonsMap[archetype.id];

        button.alpha = canAfford ? 1 : .5;
        button.interactive = canAfford;

    }.bind(this));

}
