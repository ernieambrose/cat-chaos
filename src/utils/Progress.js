const STORAGE_KEY = 'catChaosProgress';

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function setProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveResult(levelId, stars) {
  const progress = getProgress();
  progress[levelId] = Math.max(progress[levelId] || 0, stars);
  setProgress(progress);
}

export function getBestStars(levelId) {
  return getProgress()[levelId] || 0;
}

export function getHighestCompletedLevel() {
  const progress = getProgress();
  const completedLevels = Object.keys(progress).map(Number);
  return completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
}

export function isLevelUnlocked(levelId) {
  if (levelId === 1) return true;
  return getHighestCompletedLevel() >= levelId - 1;
}
