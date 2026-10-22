import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = nom du dépôt GitHub (https://<user>.github.io/genshin-manager/)
export default defineConfig({ base: '/genshin-manager/', plugins: [react()] });
