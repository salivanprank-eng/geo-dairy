/**
 * Single source of truth for colours used by BOTH CSS and the WebGL layer.
 * The CSS custom properties in styles/index.css mirror these values — change
 * them together, or the 3D diagrams drift out of the design system.
 */
export const PALETTE = {
  ink: '#0B1A14',
  graphite: '#16241E',
  slate: '#46564F',
  muted: '#5F6B65',
  line: '#E2E3DA',
  lineStrong: '#CFD2C7',
  mist: '#ECEDE5',
  cream: '#F6F5F0',
  milk: '#FCFBF7',

  brand: '#43A047',
  brandDeep: '#2A7230',
  signal: '#F4C543',

  ecosystem: '#1F7A8C',
  trade: '#B07A2B',
  service: '#3D5A80',
  supply: '#6B7F4E',
  production: '#43A047',
} as const;

/** Value-chain stage colours used by the 3D chain diagram. */
export const STAGE_COLOR = {
  upstream: PALETTE.production,
  midstream: PALETTE.service,
  downstream: PALETTE.trade,
  'cross-chain': PALETTE.ecosystem,
} as const;
