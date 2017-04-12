import * as PIXI from 'pixi.js';

import PanelUI from './PanelUI';
import ValueBarUI from './ValueBarUI';
import InhabitantsUI from './InhabitantsUI';

export default class BuildingUI extends PanelUI {

    constructor(world) {

        super(world, 'building');

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

        this.inhabitants = new InhabitantsUI(this.background.width - 40, 200);
        this.inhabitants.x = 20;
        this.inhabitants.y = 90;
        this.background.addChild(this.inhabitants);

    }

    update(timeDelta, world) {

        if (this.shown && this.activeBuilding) {

            this.integrity.setValue(this.activeBuilding.integrity.val());

        }

    }

    setBuilding(building) {

        if (this.activeBuilding != building) {

            this.activeBuilding = building;

            this.textTitle.text = building.archetype.title;
            this.textDescription.text = building.archetype.description;
            this.integrity.setValue(building.integrity.val());

            this.inhabitants.setInhabitants(building.inhabitants);

        }

    }

}
