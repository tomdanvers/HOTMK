import * as PIXI from 'pixi.js';

export default class InhabitantsUI extends PIXI.Container {

    constructor(width, height) {

        super();

        this.widthMax = width;
        this.heightMax = height;

        this.inhabitants = [];

    }

    setInhabitants(inhabitants) {

        this.clearInhabitants();

        if (this.activeInhabitants != inhabitants) {

            this.activeInhabitants = inhabitants;

            inhabitants.list.forEach(function(inhabitant, index) {

                let inhabitantUI = new InhabitantUI(this.widthMax, 40);
                inhabitantUI.x = 0;
                inhabitantUI.y = index * 50;
                inhabitantUI.setInhabitant(inhabitant);
                this.addChild(inhabitantUI);

                this.inhabitants.push(inhabitantUI);

            }.bind(this));

        }

    }

    clearInhabitants() {

        this.inhabitants.forEach(function(inhabitantUI) {

            inhabitantUI.destroy();

        });

    }

}


class InhabitantUI extends PIXI.Container {

    constructor(width, height) {

        super();

        this.widthMax = width;
        this.heightMax = height;

        var style = {
            font : '16px Arial',
            fill : '#FFFFFF',
            wordWrap : true,
            wordWrapWidth : this.widthMax - 40
        };

        this.textTitle = new PIXI.Text('title', style);
        this.addChild(this.textTitle);

        style.font = '12px Arial';

        this.textDescription = new PIXI.Text('description', style);
        this.textDescription.y = 20;
        this.textDescription.alpha = .75;
        this.addChild(this.textDescription);

    }

    setInhabitant(inhabitant) {

        this.activeInhabitant = inhabitant;

        inhabitant.on('filled:true', this.update.bind(this));
        inhabitant.on('filled:false', this.update.bind(this));

        this.on('mousedown', this.onDown.bind(this));
        this.on('touchstart', this.onDown.bind(this));

        this.update();

    }

    update() {

        if (this.activeInhabitant.isFilled) {

            this.textTitle.text = this.activeInhabitant.dwarf.name;
            this.textDescription.text = this.activeInhabitant.archetype.id;

        } else {

            this.textTitle.text = 'Hire replacement ' + this.activeInhabitant.archetype.id;
            this.textDescription.text = 'For ' + this.activeInhabitant.archetype.cWood + ' wood and ' + this.activeInhabitant.archetype.cStone+' stone.';

        }

        this.interactive = !this.activeInhabitant.isFilled;

    }

    clearInhabitants() {

        this.inhabitants.forEach(function(inhabitantUI) {

            inhabitantUI.destroy();

        });

    }

    onDown() {

        this.activeInhabitant.spawn(true, false);

    }

}
