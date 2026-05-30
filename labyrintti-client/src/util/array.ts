/**
 * Returns a new array with the elements randomly reordered, using the
 * Fisher–Yates (Knuth) shuffle. Unlike `arr.sort(() => Math.random() - 0.5)`
 * this produces a uniformly random permutation in O(n) time. The original
 * array is left untouched.
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
