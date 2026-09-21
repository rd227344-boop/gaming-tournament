import { PointTableStyleConfig, TableStyleTheme } from '../types';

/**
 * Robust kills input sanitization:
 * - Automatically handles leading zeros ('010' -> 10, '005' -> 5, '0' -> 0)
 * - Returns clean positive integer
 */
export function sanitizeKillsInput(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) || value < 0 ? 0 : Math.floor(value);
  }
  const clean = value.replace(/[^\d]/g, '');
  if (!clean) return 0;
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Format kills for input display so user sees '10' instead of '010', '5' instead of '005', '0' for 0
 */
export function formatKillsForDisplay(value: string | number): string {
  const num = sanitizeKillsInput(value);
  return num.toString();
}

/**
 * Official Placement Points Matrix for competitive titles
 */
export function getPlacementPoints(rank: number, gameName: string = ''): number {
  const clean = (gameName || '').toLowerCase();
  
  if (clean.includes('free fire')) {
    // Free Fire Official 12-point system
    switch (rank) {
      case 1: return 12;
      case 2: return 9;
      case 3: return 8;
      case 4: return 7;
      case 5: return 6;
      case 6: return 5;
      case 7: return 4;
      case 8: return 3;
      case 9: return 2;
      case 10: return 1;
      default: return 0;
    }
  } else if (clean.includes('bgmi')) {
    // BGMI BGIS/BMPS Official 10-point system
    switch (rank) {
      case 1: return 10;
      case 2: return 6;
      case 3: return 5;
      case 4: return 4;
      case 5: return 3;
      case 6: return 2;
      case 7: return 1;
      case 8: return 1;
      default: return 0;
    }
  } else if (clean.includes('apex')) {
    // ALGS matrix
    switch (rank) {
      case 1: return 12;
      case 2: return 9;
      case 3: return 7;
      case 4: return 5;
      case 5: return 4;
      case 6: return 3;
      case 7: return 3;
      case 8: return 2;
      case 9: return 2;
      case 10: return 2;
      case 11:
      case 12:
      case 13:
      case 14:
      case 15: return 1;
      default: return 0;
    }
  } else if (clean.includes('cod') || clean.includes('duty')) {
    // CODM BR matrix
    switch (rank) {
      case 1: return 15;
      case 2: return 12;
      case 3: return 10;
      case 4: return 8;
      case 5: return 6;
      case 6: return 5;
      case 7: return 4;
      case 8: return 3;
      case 9: return 2;
      case 10: return 1;
      default: return 0;
    }
  } else {
    // Default Battle Royale / standard matrix
    return Math.max(0, 11 - rank);
  }
}

/**
 * Built-in Point Table Styles
 */
export const AVAILABLE_TABLE_STYLES: PointTableStyleConfig[] = [
  {
    themeId: 'titanium-dark',
    name: 'Esports Titanium Dark',
    primaryColor: '#10b981', // Emerald
    accentColor: '#38bdf8', // Sky
    headerBg: 'bg-slate-950/90',
    rowBg: 'bg-slate-900/80',
    borderColor: 'border-slate-800',
    fontStyle: 'chakra'
  },
  {
    themeId: 'neon-strike',
    name: 'Cyberpunk Neon Strike',
    primaryColor: '#06b6d4', // Cyan
    accentColor: '#f59e0b', // Amber
    headerBg: 'bg-slate-950/95',
    rowBg: 'bg-cyan-950/20',
    borderColor: 'border-cyan-500/30',
    fontStyle: 'chakra'
  },
  {
    themeId: 'crimson-warlord',
    name: 'Crimson Warlord',
    primaryColor: '#ef4444', // Red
    accentColor: '#f97316', // Orange
    headerBg: 'bg-stone-950/95',
    rowBg: 'bg-red-950/25',
    borderColor: 'border-red-600/40',
    fontStyle: 'chakra'
  },
  {
    themeId: 'champion-gold',
    name: 'Royal Champion Gold',
    primaryColor: '#eab308', // Gold
    accentColor: '#f59e0b', // Amber
    headerBg: 'bg-amber-950/70',
    rowBg: 'bg-slate-900/90',
    borderColor: 'border-amber-500/40',
    fontStyle: 'chakra'
  },
  {
    themeId: 'circuit-emerald',
    name: 'BGIS Circuit Emerald',
    primaryColor: '#059669', // Emerald
    accentColor: '#14b8a6', // Teal
    headerBg: 'bg-emerald-950/80',
    rowBg: 'bg-zinc-900/85',
    borderColor: 'border-emerald-500/40',
    fontStyle: 'mono'
  },
  {
    themeId: 'vanguard-amethyst',
    name: 'Vanguard Amethyst',
    primaryColor: '#8b5cf6', // Violet
    accentColor: '#ec4899', // Pink
    headerBg: 'bg-purple-950/80',
    rowBg: 'bg-slate-900/80',
    borderColor: 'border-purple-500/40',
    fontStyle: 'chakra'
  }
];

export const GALLERY_BACKGROUND_PRESETS = [
  {
    id: 'arena-stadium',
    title: 'Neon Esports Stadium',
    previewUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cyber-circuit',
    title: 'Cyber Circuit Matrix',
    previewUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fire-battlefield',
    title: 'Battle Royale Warzone',
    previewUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tactical-dark',
    title: 'Tactical Obsidian Grid',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  }
];

export function getDefaultStyleConfig(): PointTableStyleConfig {
  return AVAILABLE_TABLE_STYLES[0];
}
