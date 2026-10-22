import { createRoot } from 'react-dom/client';
import seed from './data/seed.json';
import type { AccountData } from './domain/types';
import { classifyHistory, pullStats } from './domain/pulls';

const data = seed as unknown as AccountData;
const stats = pullStats(classifyHistory(data.pulls.character, data.reference.standardCharacters));

createRoot(document.getElementById('root')!).render(
  <main style={{ fontFamily: 'system-ui', padding: 24 }}>
    <h1>Genshin Account Manager — V0</h1>
    <p>Bannière perso : {stats.totalPulls} vœux, {stats.fiveStars} 5★, win rate {(stats.winRate * 100).toFixed(0)} %.</p>
  </main>,
);
