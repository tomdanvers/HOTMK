import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

export default function PanelController() {

    this.panels = [];
    this.panelsMap = {};

    this.current = false;

}

PanelController.constructor = PanelController;

PanelController.prototype.add = function(panel) {

    if (panel.id === undefined) {
        console.error('PanelController.add(PANEL HAS NO ID)');
    }

    this.panels.push(panel);
    this.panelsMap[panel.id] = panel

    panel.on('toggle:on', this.panelOn.bind(this));
    panel.on('toggle:off', this.panelOff.bind(this));

    console.log('PanelController.add(',panel.id,')')

}

PanelController.prototype.panelOn = function(id) {


    if (this.current) {

        this.current.toggle(false, false);

    }

    console.log('PanelController.panelOn(', id, ')');

    this.current = this.panelsMap[id];

}

PanelController.prototype.panelOff = function(id) {

    if (this.current && this.current.id === id) {

        this.current = false;

    }

    console.log('PanelController.panelOff(', id, ')');

}
