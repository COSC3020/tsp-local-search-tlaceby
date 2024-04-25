/**
 * @param {number} numVertices
 * @param {number} maxDistance
 * @returns {number[][]}
 */
function generateRandomDistances(numVertices, maxDistance) {
  const distances = Array.from({ length: numVertices }, () =>
    Array(numVertices).fill(0)
  );

  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      if (i !== j) {
        distances[i][j] = Math.floor(Math.random() * maxDistance) + 1;
        distances[j][i] = distances[i][j];
      }
    }
  }

  return distances;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const maxDistance = 100;

let numVertices;
let distances;
let n;
let points;
let delay;
let iterations;

document.getElementById("start").addEventListener("click", visualize);

function visualize() {
  numVertices = parseInt(document.getElementById("nodes").value);
  delay = parseInt(document.getElementById("delay").value);
  iterations = parseInt(document.getElementById("iterations").value);
  console.log(numVertices);
  distances = generateRandomDistances(numVertices, maxDistance);
  n = distances.length;

  points = initializePoints(numVertices); // Pass numVertices as a parameter
  drawPoints(points);
  tsp_ls(distances);
}

function drawPoints(points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach((point, _) => {
    const x = point[0];
    const y = point[1];
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });
}

// TODO: Trace path animated. Delay between each path trace.
function drawRoute(route, points, done = false) {
  drawPoints(points);
  ctx.beginPath();
  route.forEach((_, i) => {
    const x1 = points[route[i]][0];
    const y1 = points[route[i]][1];
    const x2 = points[route[(i + 1) % route.length]][0];
    const y2 = points[route[(i + 1) % route.length]][1];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  });
  ctx.strokeStyle = done ? "yellow" : "rgba(255, 255, 255, 0.1)";
  ctx.stroke();
  ctx.closePath();
}

function initializePoints() {
  const points = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    points.push([x, y]);
  }

  return points;
}

/**
 * @param {number[][]} distances
 */
async function tsp_ls(distances) {
  document.getElementById("start").disabled = true;
  const n = distances.length;

  let route = randomRoute(n);
  let shortestDistance = calculateRouteLength(route, distances);

  for (let iteration = 0; iteration <= iterations; iteration++) {
    const newRoute = optSwap(route);
    const newDistance = calculateRouteLength(newRoute, distances);

    if (newDistance < shortestDistance) {
      route = newRoute;
      shortestDistance = newDistance;

      drawRoute(newRoute, points);
      await new Promise((r) => setTimeout(r, delay));

      document.getElementById(
        "distance"
      ).innerText = `Distance: ${shortestDistance.toFixed(1)}`;
    }

    document.getElementById(
      "iteration-count"
    ).innerText = `Iteration: ${iteration}`;
  }

  /**
   * @param {number[]} route
   * @returns {number[]}
   */
  function optSwap(route) {
    // Choose random i and k such that 1 <= i < k < n - 1
    // i must be less than k and the `tour` size must be larger than k.
    // By chosing these values of i and k I expect that atleast some of the values are being randomly generated.
    // The lower the i and higher the k the better but I dont know for sure how to maximize these values.
    let i = Math.floor(Math.random() * (n - 1));
    let k = i + Math.floor(Math.random() * (n - i));
    const newRoute = Array.from(route);

    while (i < k) {
      // Swap elements at i and k
      [newRoute[i], newRoute[k]] = [newRoute[k], newRoute[i]];
      i++;
      k--;
    }

    return newRoute;
  }

  drawRoute(route, points, true);
  document.getElementById("start").disabled = false;
  return shortestDistance;
}

/**
 * @param {number[]} route
 * @param {number[][]} distances
 * @returns {number}
 */
function calculateRouteLength(route, distances) {
  let length = 0;
  for (let i = 0; i < route.length - 1; i++) {
    length += distances[route[i]][route[i + 1]];
  }

  return length;
}

/**
 * @param {number} n
 * @returns {number[]}
 */
function randomRoute(n) {
  let route = [];
  for (let i = 0; i < n; i++) {
    route.push(i);
  }

  // Shuffle
  return route.sort(() => Math.random() - 0.5);
}
