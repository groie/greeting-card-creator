export interface TemplateLayer {
  text: string;
  fontFamily: string;
  fontSizeFrac: number;
  fontWeight?: 'normal' | 'bold';
  italic?: boolean;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right';
  leftFrac: number;
  topFrac: number;
  widthFrac: number;
  opacity?: number;
  shadow?: boolean;
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface Template {
  id: string;
  name: string;
  thumbBg: string;
  layers: TemplateLayer[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    thumbBg: 'linear-gradient(135deg, #f9a8d4 0%, #fb923c 100%)',
    layers: [
      {
        text: 'Happy Birthday!',
        fontFamily: 'Pacifico',
        fontSizeFrac: 0.11,
        leftFrac: 0.5,
        topFrac: 0.18,
        widthFrac: 0.95,
        textAlign: 'center',
      },
      {
        text: 'Wishing you joy and laughter',
        fontFamily: 'Montserrat',
        fontSizeFrac: 0.045,
        leftFrac: 0.5,
        topFrac: 0.85,
        widthFrac: 0.8,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'thank-you',
    name: 'Thank You',
    thumbBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    layers: [
      {
        text: 'Thank',
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        italic: true,
        fontSizeFrac: 0.14,
        leftFrac: 0.5,
        topFrac: 0.18,
        widthFrac: 0.9,
        textAlign: 'center',
      },
      {
        text: 'you',
        fontFamily: 'Great Vibes',
        fontSizeFrac: 0.16,
        leftFrac: 0.5,
        topFrac: 0.82,
        widthFrac: 0.9,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'congratulations',
    name: 'Congratulations',
    thumbBg: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
    layers: [
      {
        text: 'CONGRATS',
        fontFamily: 'Bebas Neue',
        fontSizeFrac: 0.14,
        leftFrac: 0.5,
        topFrac: 0.18,
        widthFrac: 0.95,
        textAlign: 'center',
      },
      {
        text: 'So proud of you',
        fontFamily: 'Caveat',
        fontSizeFrac: 0.07,
        leftFrac: 0.5,
        topFrac: 0.85,
        widthFrac: 0.8,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'holiday',
    name: 'Holiday Greetings',
    thumbBg: 'linear-gradient(135deg, #064e3b 0%, #14532d 100%)',
    layers: [
      {
        text: 'Season’s',
        fontFamily: 'DM Serif Display',
        italic: true,
        fontSizeFrac: 0.1,
        leftFrac: 0.5,
        topFrac: 0.16,
        widthFrac: 0.9,
        textAlign: 'center',
      },
      {
        text: 'Greetings',
        fontFamily: 'DM Serif Display',
        italic: true,
        fontSizeFrac: 0.1,
        leftFrac: 0.5,
        topFrac: 0.28,
        widthFrac: 0.9,
        textAlign: 'center',
        fill: '#fca5a5',
      },
      {
        text: 'with love from our family',
        fontFamily: 'Lora',
        italic: true,
        fontSizeFrac: 0.04,
        leftFrac: 0.5,
        topFrac: 0.88,
        widthFrac: 0.8,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    thumbBg: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
    layers: [
      {
        text: 'Forever',
        fontFamily: 'Great Vibes',
        fontSizeFrac: 0.14,
        leftFrac: 0.5,
        topFrac: 0.18,
        widthFrac: 0.9,
        textAlign: 'center',
        fill: '#fde68a',
      },
      {
        text: '& Always',
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fontSizeFrac: 0.1,
        leftFrac: 0.5,
        topFrac: 0.84,
        widthFrac: 0.9,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'get-well',
    name: 'Get Well Soon',
    thumbBg: 'linear-gradient(135deg, #bae6fd 0%, #a5f3fc 100%)',
    layers: [
      {
        text: 'Get Well',
        fontFamily: 'Dancing Script',
        fontWeight: 'bold',
        fontSizeFrac: 0.12,
        leftFrac: 0.5,
        topFrac: 0.18,
        widthFrac: 0.95,
        textAlign: 'center',
      },
      {
        text: 'Soon',
        fontFamily: 'Dancing Script',
        fontWeight: 'bold',
        fontSizeFrac: 0.12,
        leftFrac: 0.5,
        topFrac: 0.3,
        widthFrac: 0.95,
        textAlign: 'center',
      },
      {
        text: 'thinking of you',
        fontFamily: 'Lora',
        italic: true,
        fontSizeFrac: 0.04,
        leftFrac: 0.5,
        topFrac: 0.86,
        widthFrac: 0.7,
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'with-love',
    name: 'With Love',
    thumbBg: 'linear-gradient(135deg, #fda4af 0%, #f9a8d4 100%)',
    layers: [
      {
        text: 'with',
        fontFamily: 'Caveat',
        fontSizeFrac: 0.08,
        leftFrac: 0.5,
        topFrac: 0.2,
        widthFrac: 0.6,
        textAlign: 'center',
      },
      {
        text: 'Love',
        fontFamily: 'Great Vibes',
        fontSizeFrac: 0.2,
        leftFrac: 0.5,
        topFrac: 0.8,
        widthFrac: 0.95,
        textAlign: 'center',
        fill: '#fecaca',
      },
    ],
  },
  {
    id: 'hello',
    name: 'Hello',
    thumbBg: 'linear-gradient(135deg, #0066ff 0%, #6366f1 100%)',
    layers: [
      {
        text: 'Hello.',
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        fontSizeFrac: 0.16,
        leftFrac: 0.5,
        topFrac: 0.2,
        widthFrac: 0.95,
        textAlign: 'center',
      },
      {
        text: 'just thinking of you',
        fontFamily: 'Inter',
        fontSizeFrac: 0.04,
        leftFrac: 0.5,
        topFrac: 0.86,
        widthFrac: 0.8,
        textAlign: 'center',
      },
    ],
  },
];
