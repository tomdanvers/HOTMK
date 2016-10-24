export default {

    distanceBetween(a, b) {

        return Math.hypot(a.x-b.x, a.y-b.y);

    },

    nearest(referencePoint, items) {

        let distanceToClosest = Number.MAX_VALUE;
        let closest = false;

        items.forEach(function(item) {

            let distance = this.distanceBetween(referencePoint, item);

            if (distance < distanceToClosest) {
                distanceToClosest = distance;
                closest = item;
            }

        }.bind(this));

        return closest;

    }

}
