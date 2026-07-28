export function makeLayer(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: '',
    inset: false,
    x: 4,
    y: 4,
    blur: 12,
    spread: 0,
    color: '#000000',
    alpha: 0.25,
    mirror: false,
    uniform: false,
    ...overrides
  };
}

export function defaultLayers() {
  return [
    makeLayer({ inset: true, x: -4, y: -4, blur: 10, spread: 0, alpha: 0.25 }),
    makeLayer({ inset: true, x: 1, y: 1, blur: 6.4, spread: 1, alpha: 0.25 }),
    makeLayer({ inset: false, x: -4, y: -4, blur: 12, spread: 0, alpha: 0.25 }),
    makeLayer({ inset: false, x: 4, y: 4, blur: 12, spread: 0, alpha: 0.25 })
  ];
}

export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');
}

export function colorToHexAlpha(str) {
  str = str.trim();
  const rgbaMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return { hex: rgbToHex(+r, +g, +b), alpha: a !== undefined ? parseFloat(a) : 1 };
  }
  const hexMatch = str.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return { hex: '#' + h, alpha: 1 };
  }
  return { hex: '#000000', alpha: 0.25 };
}

function layerLine(l, x, y) {
  const rgb = hexToRgb(l.color);
  return `${l.inset ? 'inset ' : ''}${x}px ${y}px ${l.blur}px ${l.spread}px rgba(${rgb}, ${l.alpha})`;
}

export function buildShadowCSS(layers) {
  const lines = [];
  layers.forEach(l => {
    if (l.uniform) {
      const d = Math.round(Math.sqrt(l.x * l.x + l.y * l.y) * 100) / 100;
      [[d, 0], [-d, 0], [0, d], [0, -d]].forEach(([x, y]) => lines.push(layerLine(l, x, y)));
    } else if (l.mirror) {
      const seen = new Set();
      [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
        const x = l.x * sx, y = l.y * sy;
        const key = `${x},${y}`;
        if (seen.has(key)) return;
        seen.add(key);
        lines.push(layerLine(l, x, y));
      });
    } else {
      lines.push(layerLine(l, l.x, l.y));
    }
  });
  return lines.join(',\n    ');
}

export function buildFullCSS({ bgColor, radius, layers }) {
  return `background: ${bgColor};
border-radius: ${radius}px;
box-shadow:
    ${buildShadowCSS(layers)};`;
}

function splitTopLevel(str) {
  const parts = [];
  let depth = 0, current = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function extractDeclarationValue(css, prop) {
  const re = new RegExp(prop + '\\s*:\\s*([^;]+);?', 'i');
  const match = css.match(re);
  return match ? match[1].trim() : null;
}

function parseShadowLayer(str) {
  str = str.trim();
  let inset = false;
  if (/^inset\b/i.test(str)) {
    inset = true;
    str = str.replace(/^inset\s*/i, '');
  }
  str = str.replace(/inset\s*$/i, () => { inset = true; return ''; });

  const colorMatch = str.match(/(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}|\b[a-zA-Z]+\b)\s*$/);
  let colorStr = 'rgba(0,0,0,0.25)';
  let numsStr = str;
  if (colorMatch) {
    colorStr = colorMatch[1];
    numsStr = str.slice(0, colorMatch.index).trim();
  }

  const nums = numsStr.match(/-?[\d.]+px|-?[\d.]+/g) || [];
  const vals = nums.map(n => parseFloat(n));
  const [x = 0, y = 0, blur = 0, spread = 0] = vals;
  const { hex, alpha } = colorToHexAlpha(colorStr);

  return makeLayer({ inset, x, y, blur, spread, color: hex, alpha });
}

export function parsePastedCSS(raw) {
  const result = { bgColor: null, radius: null, layers: null, found: false };

  const bgVal = extractDeclarationValue(raw, 'background-color') || extractDeclarationValue(raw, 'background');
  if (bgVal) {
    result.bgColor = colorToHexAlpha(bgVal).hex;
    result.found = true;
  }

  const radiusVal = extractDeclarationValue(raw, 'border-radius');
  if (radiusVal) {
    const n = parseFloat(radiusVal);
    if (!isNaN(n)) {
      result.radius = Math.min(200, Math.max(0, n));
      result.found = true;
    }
  }

  const shadowVal = extractDeclarationValue(raw, 'box-shadow');
  if (shadowVal) {
    const parsed = splitTopLevel(shadowVal).map(parseShadowLayer);
    if (parsed.length) {
      result.layers = parsed;
      result.found = true;
    }
  }

  return result;
}

export function shadeColor(hex, percent) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const amt = Math.round(2.55 * percent);
  return rgbToHex(r + amt, g + amt, b + amt);
}

export const STYLE_PRESETS = ['flat', 'convex', 'concave', 'pressed'];

export function buildPresetLayers(style, bgColor) {
  const light = shadeColor(bgColor, 20);
  const dark = shadeColor(bgColor, -20);

  if (style === 'flat') {
    return [];
  }

  if (style === 'convex') {
    return [
      makeLayer({ inset: false, x: -6, y: -6, blur: 12, spread: 0, color: light, alpha: 0.6 }),
      makeLayer({ inset: false, x: 6, y: 6, blur: 12, spread: 0, color: dark, alpha: 0.5 })
    ];
  }

  if (style === 'concave') {
    return [
      makeLayer({ inset: true, x: -6, y: -6, blur: 12, spread: 0, color: dark, alpha: 0.5 }),
      makeLayer({ inset: true, x: 6, y: 6, blur: 12, spread: 0, color: light, alpha: 0.6 })
    ];
  }

  if (style === 'pressed') {
    return [
      makeLayer({ inset: true, x: 4, y: 4, blur: 8, spread: 0, color: dark, alpha: 0.5, uniform: true }),
      makeLayer({ inset: true, x: -2, y: -2, blur: 6, spread: 0, color: light, alpha: 0.4, uniform: true })
    ];
  }

  return [];
}