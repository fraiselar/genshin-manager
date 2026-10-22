import type { AccountData, CharacterGoal } from './types';

/** Nombre d'exemplaires obtenus (4 sources dans l'Excel : perso, chronique, standard, sélecteur). */
export function copiesOwned(name: string, data: AccountData): number {
  const count = (items: { item: string }[]) => items.filter((p) => p.item === name).length;
  return (
    count(data.pulls.character) +
    count(data.pulls.chronicled) +
    count(data.pulls.standard) +
    data.selectorGrants.filter((g) => g.character === name).length
  );
}

/** null = non possédé (l'Excel utilise -1). C0 = 1 exemplaire. */
export function currentConstellation(name: string, data: AccountData): number | null {
  const copies = copiesOwned(name, data);
  return copies === 0 ? null : copies - 1;
}

/**
 * Objectif atteint ? Corrige le « Done? » de l'Excel (B3-B4+B5-B6 = 0), qui peut se
 * compenser entre constellations et raffinements et qui ignore le skin.
 * Le skin est volontairement exclu tant que Q3 n'est pas tranchée.
 */
export function isGoalComplete(goal: CharacterGoal, cons: number | null): boolean {
  if (cons === null) return false;
  return cons >= goal.consNeeded && goal.currentRefinement >= goal.refinementNeeded;
}

/** Pulls dépensés pour un perso : pity de ses 5★ + pity des 50/50 perdus face à lui. */
export function pullsSpentOn(name: string, data: AccountData): number {
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  return sum(
    [
      ...data.pulls.character.filter((p) => p.item === name || p.lost === name),
      ...data.pulls.chronicled.filter((p) => p.item === name),
      ...data.pulls.standard.filter((p) => p.item === name),
    ].map((p) => p.pity),
  );
}
