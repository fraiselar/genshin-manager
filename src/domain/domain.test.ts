import { describe, expect, it } from 'vitest';
import seed from '../data/seed.json';
import type { AccountData } from './types';
import { classifyHistory, pullStats } from './pulls';
import { copiesOwned, currentConstellation, isGoalComplete, pullsSpentOn } from './collection';

const data = seed as unknown as AccountData;
const history = classifyHistory(data.pulls.character, data.reference.standardCharacters);

describe('bannière perso — valeurs réelles de Fraise.xlsx', () => {
  it('Win / Lose / Guaranteed (Pulls!C8:C10)', () => {
    expect(history.map((h) => [h.item, h.result])).toEqual([
      ['Vesna', 'win'],
      ['Keqing', 'lose'],
      ['Vodyanitsa', 'guaranteed'],
    ]);
  });
  it('streaks (Pulls!G8:G10 = 1, -1, -1)', () => {
    expect(history.map((h) => h.streak)).toEqual([1, -1, -1]);
  });
  it('stats (Pulls!A2, E1:E4, E3, G1, G3)', () => {
    const s = pullStats(history);
    expect(s.totalPulls).toBe(137);
    expect(s.fiveStars).toBe(3);
    expect(s.winRate).toBe(0.5);
    expect(s.averagePity).toBeCloseTo(45.6667, 3);
    expect(s.maxPity).toBe(80);
    expect(s.minPity).toBe(2);
    expect(s.maxWinStreak).toBe(1);
    expect(s.maxLoseStreak).toBe(-1);
  });
});

describe('collection — Characters!4:4 et 9:9', () => {
  it('constellations déduites (Vesna, Keqing, Tighnari, Mona = C0 ; Kokomi = non possédée)', () => {
    for (const n of ['Vesna', 'Keqing', 'Tighnari', 'Mona', 'Chiori', 'Yumemizuki Mizuki', 'Vodyanitsa'])
      expect(currentConstellation(n, data)).toBe(0);
    expect(currentConstellation('Sangonomiya Kokomi', data)).toBeNull();
    expect(copiesOwned('Navia', data)).toBe(0);
  });
  it('pulls dépensés pour Vodyanitsa = 55 (50/50 perdu) + 2 = 57', () => {
    expect(pullsSpentOn('Vodyanitsa', data)).toBe(57);
    expect(pullsSpentOn('Vesna', data)).toBe(80);
  });
  it('objectif : Chiori C6 pas atteint à C0 ; perso sans objectif possédé = atteint', () => {
    expect(isGoalComplete(data.goals['Chiori'], 0)).toBe(false);
    expect(isGoalComplete(data.goals['Vesna'], 0)).toBe(true);
    expect(isGoalComplete(data.goals['Vesna'], null)).toBe(false);
  });
});
