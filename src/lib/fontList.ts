export interface FontDef {
  name: string;
  weights: number[];
  category: 'sans' | 'serif' | 'script' | 'display';
}

export const FONTS: FontDef[] = [
  { name: 'Inter', weights: [400, 700], category: 'sans' },
  { name: 'Montserrat', weights: [400, 700], category: 'sans' },
  { name: 'Oswald', weights: [400, 700], category: 'sans' },
  { name: 'Bebas Neue', weights: [400], category: 'sans' },
  { name: 'Playfair Display', weights: [400, 700], category: 'serif' },
  { name: 'Lora', weights: [400, 700], category: 'serif' },
  { name: 'Merriweather', weights: [400, 700], category: 'serif' },
  { name: 'DM Serif Display', weights: [400], category: 'serif' },
  { name: 'Great Vibes', weights: [400], category: 'script' },
  { name: 'Pacifico', weights: [400], category: 'script' },
  { name: 'Dancing Script', weights: [400, 700], category: 'script' },
  { name: 'Caveat', weights: [400, 700], category: 'script' },
];

export const DEFAULT_FONT = 'Inter';
