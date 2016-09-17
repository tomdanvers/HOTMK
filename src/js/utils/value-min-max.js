module.exports = function(min, max, initial) {

	var value = initial || max;
	var api = {
		get: get,
        getRemainder: getRemainder,
		set: set,
		increment: increment,
		decrement: decrement,
		isMax: isMax,
		isMin: isMin,
		simplify: simplify,
		val: val
	};

	function get() {

		return value;

	}

    function getRemainder() {

        return max - value;

    }

	function set(val) {

		value = constrain(val);

	}

	function increment(val) {

		value = constrain(value + val);

	}

	function decrement(val) {

		value = constrain(value - val);

	}

	function isMin() {

		return value === min;

	}

	function isMax() {

		return value === max;

	}

	function constrain(val) {

		return val < min ? min : val > max ? max : val;

	}

	function val() {

		return (value - min) / (max - min);

	}

	function simplify() {

		return {
			min: min,
			value: value,
			max: max
		};

	}

	return api;

}
