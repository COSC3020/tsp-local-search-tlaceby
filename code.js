/**
 * @param {number[][]} distances
 */
function tsp_ls(distances) {
  // TODO: Impliment a distance minimization check instead of arbitrary distances.
  // An aribitary large number of iterations to test is the stopping criteria
  // From what I read this should be when the distance is being minimized aka the delta distance approaches zero.
  const maxIterations = 1_000_000;
  const n = distances.length;

  let route = randomRoute(n);
  let shortestDistance = calculateRouteLength(route, distances);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const newRoute = optSwap(route);
    const newDistance = calculateRouteLength(newRoute, distances);

    if (newDistance < shortestDistance) {
      route = newRoute;
      shortestDistance = newDistance;
    }
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

module.exports = {
  tsp_ls,
};
