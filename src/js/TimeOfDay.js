import PIXI from 'pixi.js';
import ValueMinMax from './utils/ValueMinMax';

export default class TimeOfDay {

    constructor() {

        this.time = 8;
        this.count = 0;

    }

    update(timeDelta, world) {

        this.count ++;

        // this.time += timeDelta * 0.0005;
        this.time += timeDelta * 0.00005;

        let hour = this.getHour();
        let minute = this.getMinute();

        if (hour != this.hourOld || minute != this.minuteOld) {

            this.timeChanged(world, hour, minute);

        }

        this.hourOld = hour;
        this.minuteOld = minute;

        if (this.time >= 24) {

            this.time = 0;

        }

        if (this.count >= Number.MAX_VALUE) {

            this.count = 0;

        }

    }

    timeChanged(world, hour, minute) {

        world.ui.time.update(hour, minute);

    }

    getValue() {

        return this.time / 24;

    }

    getSunValue() {

        let val;

        if (this.time < TimeOfDay.DAWN_START) {

            val = 0;

        } else if (this.time < TimeOfDay.DAWN_END) {

            val = (this.time - TimeOfDay.DAWN_START) / (TimeOfDay.DAWN_END - TimeOfDay.DAWN_START);

        } else if (this.time < TimeOfDay.DUSK_START) {

            val = 1;

        } else if (this.time < TimeOfDay.DUSK_END) {

            val = 1 - (this.time - TimeOfDay.DUSK_START) / (TimeOfDay.DUSK_END - TimeOfDay.DUSK_START);

        } else {

            val = 0;

        }

        return 1 - val;

    }

    getHour() {

        return Math.floor(this.time);

    }

    getMinute() {

        return Math.floor((this.time % 1) * 60);

    }

    isDuringPeriod(start, end) {

        // NB only works for roles that are in the daytime...

        if (start > end) {

            return this.time >= start || this.time < end;

        } else {

            return this.time >= start && this.time < end;

        }


    }

}

TimeOfDay.DAWN_START = 6;
TimeOfDay.DAWN_END = 7.5;

TimeOfDay.DUSK_START = 19;
TimeOfDay.DUSK_END = 21;
