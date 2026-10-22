export type BannerType = 'character' | 'chronicled' | 'weapon' | 'standard';
export type FiftyFifty = 'win' | 'lose' | 'guaranteed';

/** Une ligne d'historique (un 5★ obtenu). `pity` = nombre de vœux depuis le 5★ précédent. */
export interface PullEntry {
  pity: number;
  item: string;
  /** Bannière perso : le perso limité perdu face au 50/50 (colonne « character lost »). */
  lost?: string | null;
  /** Gardé en texte : "7.1" (évite les soucis de flottants). */
  patch: string | null;
  region?: string | null;
}

/** Perso obtenu hors bannière (colonne « Selector » de l'Excel : sélecteurs anniversaire). */
export interface SelectorGrant {
  character: string;
  patch: string | null;
  region?: string | null;
  type: 'Standard Anni' | 'Limited Anni' | string;
}

/** Objectifs par perso (feuille « Characters »). */
export interface CharacterGoal {
  consNeeded: number;
  refinementNeeded: number;
  /** Saisi à la main dans l'Excel (non déduit). */
  currentRefinement: number;
  /** 0/1 — sémantique exacte à confirmer (voir docs/AUDIT.md, question Q3). */
  skin: number;
}

export interface ReferenceData {
  standardCharacters: string[];
  standardWeapons: string[];
}

export interface AccountData {
  version: 1;
  pulls: Record<BannerType, PullEntry[]>;
  selectorGrants: SelectorGrant[];
  goals: Record<string, CharacterGoal>;
  reference: ReferenceData;
}

export interface ClassifiedPull extends PullEntry {
  result: FiftyFifty;
  /** Série signée : >0 victoires d'affilée, <0 défaites d'affilée. */
  streak: number;
}
