import PIXI from 'pixi.js';

import Layout from '../Layout';
import Maths from '../utils/Maths';

import PanelUI from './PanelUI';

export default class ConstructionUI extends PanelUI {

    constructor(world) {

        super(world, 'construction');

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
            let archetypeButtonH = 45;

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

            let textDescription = new PIXI.Text(archetype.description + ' (' + archetype.cWood + 'W : ' + archetype.cStone + 'S)', style);
            textDescription.x = 10;
            textDescription.y = 30;
            textDescription.alpha = .75;
            archetypeButton.addChild(textDescription);

        }.bind(this));

    }

    onButtonDown(event) {

        this.toggle();

    }

    onArchetypeButtonDown(event) {

        // Wait for drag start

        // On drag start hide menu

        // Bind up listener on route

        // Show building placement

        // On Up Show confirm menu

        // On confirm place building

        // On cancel open building menu

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

    }

    onDragStart(event) {

        this.dragging = true;

        this.toggle(false);

        let pos = event.data.getLocalPosition(this.world);

        this.activeBuilding = new this.activeArchetype.c(this.world, pos.x, pos.y, this.activeArchetype, true);
        this.activeBuilding.x = pos.x;
        this.activeBuilding.y = pos.y;

        this.world.content.addChild(this.activeBuilding);

    }

    onDrag(event) {

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

    onDragEnd() {

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

    update(wood, stone) {

        this.world.buildings.archetypes.forEach(function(archetype) {

            let canAfford = archetype.cWood <= wood && archetype.cStone <= stone;

            let button = this.archetypeButtonsMap[archetype.id];

            button.alpha = canAfford ? 1 : .5;
            button.interactive = canAfford;

        }.bind(this));

    }

}
