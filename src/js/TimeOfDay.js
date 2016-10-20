import PIXI from 'pixi.js';
import ValueMinMax from './utils/value-min-max';

export default function TimeOfDay() {

    this.time = 16;
    this.count = 0;

}

TimeOfDay.DAWN_START = 6;
TimeOfDay.DAWN_END = 7.5;

TimeOfDay.DUSK_START = 19;
TimeOfDay.DUSK_END = 21;

TimeOfDay.constructor = TimeOfDay;

TimeOfDay.prototype.update = function(timeDelta, world) {

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

TimeOfDay.prototype.timeChanged = function(world, hour, minute) {

    world.ui.time.update(hour, minute);

}

TimeOfDay.prototype.getValue = function() {

    return this.time / 24;

}

TimeOfDay.prototype.getSunValue = function() {

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

TimeOfDay.prototype.getHour = function() {

    return Math.floor(this.time);

}

TimeOfDay.prototype.getMinute = function() {

    return Math.floor((this.time % 1) * 60);

}

TimeOfDay.prototype.isDuringPeriod = function(start, end) {

    // NB only works for roles that are in the daytime...

    if (start > end) {

        return this.time >= start || this.time < end;

    } else {

        return this.time >= start && this.time < end;

    }


}
