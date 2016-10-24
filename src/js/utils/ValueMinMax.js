export default class ValueMinMax {

    constructor(min, max, initial) {

    	this.value = initial || max;
        this.min = min;
        this.max = max;

    }

	get() {

		return this.value;

	}

    getRemainder() {

        return this.max - this.value;

    }

	set(val) {

		this.value = this.constrain(val);

	}

	increment(val) {

		this.value = this.constrain(this.value + val);

	}

	decrement(val) {

		this.value = this.constrain(this.value - val);

	}

	isMin() {

		return this.value === this.min;

	}

	isMax() {

		return this.value === this.max;

	}

	constrain(val) {

		return val < this.min ? this.min : val > this.max ? this.max : val;

	}

	val() {

		return (this.value - this.min) / (this.max - this.min);

	}

	/*simplify() {

		return {
			min: min,
			value: value,
			max: max
		};

	}*/

}
