export function calculateStars(catsRemaining, starThresholds) {
  if (catsRemaining >= starThresholds[2]) return 3;
  if (catsRemaining >= starThresholds[1]) return 2;
  return 1;
}
