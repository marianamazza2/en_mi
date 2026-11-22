import type { Theme } from '../lib'

// El mismo lugar con tres luces.
export const palettes = {
  dia: {
    sky: ['#124f70', '#1f6482', '#5598ad', '#d3ecea'], cloud: '238,250,252', cloudShade: '112,166,187', cloudAlpha: .5,
    far: ['#85b5c3', '#a7cbd2'], mid: ['#467f96', '#78aab6'], near: ['#235b6b', '#4b8791'], snow: '#eaf7f6', face: '9,56,82',
    lake: ['#9ccfd3', '#357f93', '#0c3f59'], shore: '#174c55', bank: ['#14484c', '#06262f'], tree: '#082d36', grass: '#2b6660', flower: '#d9f2ea',
    mist: '226,247,246', glint: '225,255,252', orb: { x: .83, y: .6, r: 0, glow: '235,255,250', glowAlpha: .35 },
  },
  atardecer: {
    sky: ['#1d1945', '#51305f', '#a6546f', '#f6bd86'], cloud: '255,176,145', cloudShade: '83,42,94', cloudAlpha: .48,
    far: ['#9c6387', '#c7848b'], mid: ['#60406f', '#8c5579'], near: ['#3b2855', '#5d3862'], snow: '#f7b6a2', face: '42,18,62',
    lake: ['#e49a80', '#723f69', '#22183f'], shore: '#33204a', bank: ['#2e1c42', '#120c25'], tree: '#170f2c', grass: '#5a3557', flower: '#f3ad9a',
    mist: '255,196,166', glint: '255,218,170', orb: { x: .56, y: .62, r: .075, glow: '255,196,130', glowAlpha: .65 },
  },
  noche: {
    sky: ['#030818', '#0a1738', '#1a3159', '#45648a'], cloud: '120,150,195', cloudShade: '20,38,75', cloudAlpha: .16,
    far: ['#263f66', '#385579'], mid: ['#162b4e', '#294568'], near: ['#0d1d39', '#172e50'], snow: '#8fa9c9', face: '2,9,28',
    lake: ['#42618a', '#142b50', '#040d22'], shore: '#0a1830', bank: ['#091730', '#02060f'], tree: '#020815', grass: '#1a3150', flower: '#7896bd',
    mist: '145,178,220', glint: '196,220,255', orb: { x: .8, y: .56, r: .04, glow: '160,195,245', glowAlpha: .3 },
  },
} satisfies Record<Theme, unknown>
export type Palette = (typeof palettes)[Theme]
