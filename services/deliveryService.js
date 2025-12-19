const { calculateDiscount } = require("./discountService");

function calculateDeliveries(baseCost, packages) {
  return packages.map(pkg => {
    const deliveryCost =
      baseCost + (pkg.weight * 10) + (pkg.distance * 5);

    const discount = calculateDiscount(
      pkg.offerCode,
      pkg.weight,
      pkg.distance,
      deliveryCost
    );

    return {
      id: pkg.id,
      discount: discount.toFixed(0),
      totalCost: (deliveryCost - discount).toFixed(0)
    };
  });
}

module.exports = { calculateDeliveries }; 



