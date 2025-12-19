const offers = require("../config/coupons");
const { isInRange } = require("../utils/helper");

function calculateDiscount(offerCode, weight, distance, cost) {
  if (!offers[offerCode]) return 0;

  const offer = offers[offerCode];

  if (
    isInRange(weight, offer.weight) &&
    isInRange(distance, offer.distance)
  ) {
    return (cost * offer.discount) / 100;
  }

  return 0;
}

module.exports = { calculateDiscount };
