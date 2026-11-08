export type SortMethod = "insertion" | "merge" | "quick" | "bubble";
export type SortFrame = { order: number[]; highlight: number[] };

/**
 * Records every comparison and move a sorting algorithm makes, so the shelf can replay it.
 * `start` is a list of book indices; `key` gives each book's sort value.
 */
export function recordSort(method: SortMethod, start: number[], key: (i: number) => number) {
  const a = [...start];
  const frames: SortFrame[] = [];
  let comparisons = 0;
  const cmp = (x: number, y: number) => {
    comparisons++;
    frames.push({ order: [...a], highlight: [a[x], a[y]] });
    return key(a[x]) > key(a[y]);
  };
  const swap = (x: number, y: number) => {
    [a[x], a[y]] = [a[y], a[x]];
    frames.push({ order: [...a], highlight: [a[x], a[y]] });
  };

  if (method === "insertion") {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0 && cmp(j - 1, j)) { swap(j - 1, j); j--; }
    }
  } else if (method === "bubble") {
    for (let n = a.length; n > 1; n--) {
      let swapped = false;
      for (let j = 0; j < n - 1; j++) if (cmp(j, j + 1)) { swap(j, j + 1); swapped = true; }
      if (!swapped) break;
    }
  } else if (method === "quick") {
    const q = (lo: number, hi: number) => {
      if (lo >= hi) return;
      let s = lo;
      for (let j = lo; j < hi; j++) if (!cmp(j, hi)) { if (s !== j) swap(s, j); s++; }
      if (s !== hi) swap(s, hi);
      q(lo, s - 1); q(s + 1, hi);
    };
    q(0, a.length - 1);
  } else {
    const ms = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      ms(lo, mid); ms(mid + 1, hi);
      let i = lo, m2 = mid, j = mid + 1;
      while (i <= m2 && j <= hi) {
        if (!cmp(i, j)) i++;
        else {
          const v = a[j];
          a.splice(j, 1); a.splice(i, 0, v);
          frames.push({ order: [...a], highlight: [v] });
          i++; m2++; j++;
        }
      }
    };
    ms(0, a.length - 1);
  }
  return { frames, comparisons, sorted: a };
}
