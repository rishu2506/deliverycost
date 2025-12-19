const fs = require("fs");
const {calculateDeliveries} = require("./services/deliveryService");
// Read from stdin
const input = fs
  .readFileSync(0, "utf-8")
  .replace(/\r/g, "")
  .trim()
  .split("\n");
// First line
const [baseCost, numberOfPackages] = input[0].split(" ").map(Number);

// Remaining lines
const packages = [];

for (let i = 1; i <= numberOfPackages; i++) {
  const [id, weight, distance, offerCode] = input[i].split(/\s+/);

  packages.push({
    id,
    weight: Number(weight),
    distance: Number(distance),
    offerCode
  });
}

// Calculate  question 1 part 
const results = calculateDeliveries(baseCost, packages);
// Output to stdout
results.forEach(pkg => {
  console.log(`${pkg.id} ${pkg.discount} ${pkg.totalCost}`);
});  


