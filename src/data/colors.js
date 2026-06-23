// Maps a variant option's text to a CSS colour for swatch display.
// Returns a colour string (hex or CSS name) or null if the text isn't a colour.

const COLOR_MAP = {
  // blues
  'sky blue': '#87ceeb', 'baby blue': '#89cff0', 'light blue': '#add8e6',
  'dark blue': '#00008b', 'navy': '#000080', 'navy blue': '#000080',
  'royal blue': '#4169e1', 'teal': '#008080', 'turquoise': '#40e0d0',
  // reds / pinks
  'wine': '#722f37', 'burgundy': '#800020', 'maroon': '#800000',
  'coral': '#ff7f50', 'rose': '#ff007f', 'rose gold': '#b76e79',
  'hot pink': '#ff69b4', 'baby pink': '#f4c2c2', 'peach': '#ffe5b4',
  // greens
  'army green': '#4b5320', 'olive': '#808000', 'lime': '#bfff00',
  'mint': '#98ff98', 'forest green': '#228b22',
  // neutrals
  'cream': '#fffdd0', 'off white': '#faf9f6', 'ivory': '#fffff0',
  'beige': '#f5f5dc', 'nude': '#e3bc9a', 'tan': '#d2b48c',
  'khaki': '#c3b091', 'grey': '#808080', 'gray': '#808080',
  'charcoal': '#36454f', 'ash': '#b2beb5', 'silver': '#c0c0c0',
  // warm
  'gold': '#d4af37', 'mustard': '#ffdb58', 'amber': '#ffbf00',
  // purples
  'lavender': '#e6e6fa', 'lilac': '#c8a2c8', 'violet': '#7f00ff',
  'plum': '#8e4585',
};

let _probe = null;

export function resolveColor(text) {
  if (!text || typeof text !== 'string') return null;
  const key = text.trim().toLowerCase();
  if (!key) return null;
  if (COLOR_MAP[key]) return COLOR_MAP[key];

  // Fall back to the browser's CSS named colours (e.g. "red", "skyblue").
  if (typeof document === 'undefined') return null;
  const cssName = key.replace(/\s+/g, '');
  if (!_probe) _probe = document.createElement('span');
  _probe.style.color = '';
  _probe.style.color = cssName;
  return _probe.style.color !== '' ? cssName : null;
}
