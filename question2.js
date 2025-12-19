/**
 * For second question , i have mentioned the everything in same file
 * we can extend the solution like first example 
 * As it is using the best fit knapsack problem
 * 
 */
const fs = require("fs");

/* All offeres we  can consider here */

const OFFERS = {
  OFR001: {
    discount: 0.10,
    minDistance: 0,
    maxDistance: 200,
    minWeight: 70,
    maxWeight: 200,
  },
  OFR002: {
    discount: 0.07,
    minDistance: 50,
    maxDistance: 150,
    minWeight: 100,
    maxWeight: 250,
  },
  OFR003: {
    discount: 0.05,
    minDistance: 50,
    maxDistance: 250,
    minWeight: 10,
    maxWeight: 150,
  },
};

/* -------------------- UTILS -------------------- */

function calculateDiscount(pkg, deliveryCost) {
  const offer = OFFERS[pkg.offerCode];
  if (!offer) return 0;

  if (
    pkg.distance >= offer.minDistance &&
    pkg.distance <= offer.maxDistance &&
    pkg.weight >= offer.minWeight &&
    pkg.weight <= offer.maxWeight
  ) {
    return deliveryCost * offer.discount;
  }
  return 0;
}

function round(num) {
  return Number(num.toFixed(2));
}

/**
 * Select best combination of packages with max total weight <= capacity
 * (Knapsack-lite, small N, brute-force via recursion)
 */
function selectBestPackages(packages, maxLoad) {
  let best = [];
  let bestWeight = 0;

  function backtrack(index, current, weight) {
    if (weight > maxLoad) return;
    if (weight > bestWeight) {
      bestWeight = weight;
      best = [...current];
    }
    for (let i = index; i < packages.length; i++) {
      backtrack(
        i + 1,
        [...current, packages[i]],
        weight + packages[i].weight
      );
    }
  }

  backtrack(0, [], 0);
  return best;
}

/* -------------------- MAIN LOGIC -------------------- */

// Read from stdin
const input = fs
  .readFileSync(0, "utf-8")
  .replace(/\r/g, "")
  .trim()
  .split("\n");
let line = 0;

// First line
const [baseCost, packageCount] = input[line++].split(" ").map(Number);

// Read packages
let packages = [];
for (let i = 0; i < packageCount; i++) {
  const [id, weight, distance, offerCode] = input[line++].split(/\s+/);
  packages.push({
    id,
    weight: Number(weight),
    distance: Number(distance),
    offerCode,
  });
}

// Vehicle config
const [vehicleCount, maxSpeed, maxLoad] = input[line++]
  .split(" ")
  .map(Number);

/* -------------------- COST CALCULATION -------------------- */

packages.forEach((pkg) => {
  const deliveryCost =
    baseCost + pkg.weight * 10 + pkg.distance * 5;

  const discount = calculateDiscount(pkg, deliveryCost);

  pkg.discount = Math.floor(discount);
  pkg.totalCost = Math.floor(deliveryCost - discount);
  pkg.deliveryTime = pkg.distance / maxSpeed;
});

/* -------------------- VEHICLE SCHEDULING -------------------- */

// Vehicle min-heap (simple array since N small)
let vehicles = Array.from({ length: vehicleCount }, (_, i) => ({
  id: i + 1,
  availableAt: 0,
}));

// Output map
const result = {};

// Clone packages list
let remaining = [...packages];

while (remaining.length > 0) {
  // Get earliest available vehicle
  vehicles.sort((a, b) => a.availableAt - b.availableAt);
  const vehicle = vehicles.shift();

  // Select best-fit packages
  const selected = selectBestPackages(remaining, maxLoad);

  // Remove selected from remaining
  selected.forEach((pkg) => {
    remaining = remaining.filter((p) => p.id !== pkg.id);
  });

  // Trip time = max delivery time in this batch
  const tripTime = Math.max(...selected.map((p) => p.deliveryTime));

  // Assign delivery times
  selected.forEach((pkg) => {
    result[pkg.id] = {
      discount: pkg.discount,
      totalCost: pkg.totalCost,
      estimatedDeliveryTime: round(vehicle.availableAt + pkg.deliveryTime),
    };
  });

  // Update vehicle availability (round trip)
  vehicle.availableAt += 2 * tripTime;

  vehicles.push(vehicle);
}

/* -------------------- OUTPUT -------------------- */

packages.forEach((pkg) => {
  const res = result[pkg.id];
  console.log(
    `${pkg.id} ${res.discount} ${res.totalCost} ${res.estimatedDeliveryTime.toFixed(
      2
    )}`
  );
});
