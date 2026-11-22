/**
 * Traditional blacksmith's heat-colour chart for carbon steel, approximate.
 * Colours are sRGB approximations of how the steel looks in a dim forge;
 * perceived colour shifts with ambient light, so treat this as a scale, not a spec.
 */
export const heat = [
  { c: 480, name: 'Faint red', hex: '#4f1410' },
  { c: 580, name: 'Blood red', hex: '#741a12' },
  { c: 635, name: 'Dark cherry', hex: '#922014' },
  { c: 690, name: 'Medium cherry', hex: '#ad2617' },
  { c: 745, name: 'Cherry', hex: '#c62f1a' },
  { c: 790, name: 'Bright cherry', hex: '#dc401d' },
  { c: 845, name: 'Salmon', hex: '#ec6434' },
  { c: 900, name: 'Orange', hex: '#f4862a' },
  { c: 980, name: 'Lemon', hex: '#f8c03a' },
  { c: 1090, name: 'Light yellow', hex: '#fbe27c' },
  { c: 1205, name: 'White', hex: '#fdf6dc' },
] as const;

export type HeatStop = (typeof heat)[number];
