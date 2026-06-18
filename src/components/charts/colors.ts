// Assigns each stock id a stable, visually well-separated line color.

// Smallest distance between two hues on the 0–360 color wheel (handles wrap).
const hueDistance = (a: number, b: number): number => {
  const d = Math.abs(a - b);
  return Math.min(d, 360 - d);
};

const pickHue = (existing: number[], minDistance = 50): number => {
  let hue = Math.floor(Math.random() * 360);
  for (
    let attempt = 0;
    attempt < 100 && existing.some((h) => hueDistance(hue, h) < minDistance);
    attempt++
  ) {
    hue = Math.floor(Math.random() * 360);
  }
  return hue;
};

export const buildStockColors = (
  ids: Iterable<string>,
): Record<string, string> => {
  const colors: Record<string, string> = {};
  const hues: number[] = [];

  for (const id of new Set(ids)) {
    const hue = pickHue(hues);
    hues.push(hue);
    colors[id] = `hsl(${hue}, 70%, 50%)`;
  }

  return colors;
};
