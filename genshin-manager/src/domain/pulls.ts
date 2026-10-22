import type { ClassifiedPull, FiftyFifty, PullEntry } from './types';

/**
 * Règle Excel (colonne C « 50/50 ») :
 *  - item dans la liste standard            -> lose
 *  - sinon, si le tirage précédent = lose    -> guaranteed
 *  - sinon                                   -> win
 * La garantie se propage d'un tirage au suivant au sein d'une même bannière.
 */
export function classifyFiftyFifty(
  item: string,
  previous: FiftyFifty | null,
  standardItems: readonly string[],
): FiftyFifty {
  if (standardItems.includes(item)) return 'lose';
  return previous === 'lose' ? 'guaranteed' : 'win';
}

/** Règle Excel (colonne G « streak »), départ à 0 (l'Excel hardcode 1 sur la 1re ligne). */
export function nextStreak(previous: number, result: FiftyFifty): number {
  if (result === 'win') return previous > 0 ? previous + 1 : 1;
  if (result === 'guaranteed') return previous;
  return previous < 1 ? previous - 1 : -1;
}

export function classifyHistory(
  entries: readonly PullEntry[],
  standardItems: readonly string[],
): ClassifiedPull[] {
  let prevResult: FiftyFifty | null = null;
  let prevStreak = 0;
  return entries.map((e) => {
    const result = classifyFiftyFifty(e.item, prevResult, standardItems);
    const streak = nextStreak(prevStreak, result);
    prevResult = result;
    prevStreak = streak;
    return { ...e, result, streak };
  });
}

export interface PullStats {
  totalPulls: number;
  fiveStars: number;
  averagePity: number | null;
  minPity: number | null;
  maxPity: number | null;
  wins: number;
  losses: number;
  guaranteed: number;
  /** wins / (wins + losses) — les « guaranteed » sont exclus, comme dans l'Excel. */
  winRate: number;
  maxWinStreak: number;
  maxLoseStreak: number;
}

export function pullStats(history: readonly ClassifiedPull[]): PullStats {
  const pities = history.map((h) => h.pity);
  const wins = history.filter((h) => h.result === 'win').length;
  const losses = history.filter((h) => h.result === 'lose').length;
  const sum = pities.reduce((a, b) => a + b, 0);
  return {
    totalPulls: sum,
    fiveStars: history.length,
    averagePity: pities.length ? sum / pities.length : null,
    minPity: pities.length ? Math.min(...pities) : null,
    maxPity: pities.length ? Math.max(...pities) : null,
    wins,
    losses,
    guaranteed: history.filter((h) => h.result === 'guaranteed').length,
    winRate: wins + losses ? wins / (wins + losses) : 0,
    maxWinStreak: Math.max(0, ...history.map((h) => h.streak)),
    maxLoseStreak: Math.min(0, ...history.map((h) => h.streak)),
  };
}
