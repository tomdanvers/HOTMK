import ValueMinMax from './utils/ValueMinMax';
import Maths from './utils/Maths';

export default class PanelController {

    constructor() {

        this.panels = [];
        this.panelsMap = {};

        this.current = false;

    }

    add(panel) {

        if (panel.id === undefined) {
            console.error('PanelController.add(PANEL HAS NO ID)');
        }

        this.panels.push(panel);
        this.panelsMap[panel.id] = panel

        panel.on('toggle:on', this.panelOn.bind(this));
        panel.on('toggle:off', this.panelOff.bind(this));

    }

    panelOn(id) {


        if (this.current) {

            this.current.toggle(false, false);

        }

        this.current = this.panelsMap[id];

    }

    panelOff(id) {

        if (this.current && this.current.id === id) {

            this.current = false;

        }

    }

}

