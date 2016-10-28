import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import Layout from './Layout';
import World from './World';
import PanelController from './PanelController';

import ValueBarUI from './ui/ValueBarUI';
import SupplyUI from './ui/SupplyUI';
import TimeUI from './ui/TimeUI';
import ConstructionUI from './ui/ConstructionUI';
import LogUI from './ui/LogUI';
import BuildingUI from './ui/BuildingUI';
import GameSpeedUI from './ui/GameSpeedUI';

export default class UI extends PIXI.Container {

    constructor(world) {

        super();

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

        this.gameSpeed = new GameSpeedUI(world);
        this.addChild(this.gameSpeed);

        this.panelController.add(this.building);
        this.panelController.add(this.construction);
        this.panelController.add(this.log);

    }

    update(timeDelta, world) {

        this.building.update(timeDelta, world);

    }

    updateSupply(wood, stone) {

        this.supply.update(wood, stone);
        this.construction.update(wood, stone);

    }

}
