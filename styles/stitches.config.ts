import { createStitches } from '@stitches/react';

export type Accessor<Key extends string | number> = `$${Key}`;

export type Media = keyof typeof media;
const media = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

export type Space = keyof typeof space;
const space = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export type Size = keyof typeof sizes;
const sizes = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
  auto: 'auto',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
  full: '100%',
  min: 'min-content',
  max: 'max-content',

  max0: '0rem',
  maxNone: 'none',
  maxXs: '20rem',
  maxSm: '24rem',
  maxMd: '28rem',
  maxLg: '32rem',
  maxXl: '36rem',
  max2xl: '42rem',
  max3xl: '48rem',
  max4xl: '56rem',
  max5xl: '64rem',
  max6xl: '72rem',
  max7xl: '80rem',
  maxFull: '100%',
  maxMin: 'min-content',
  maxMax: 'max-content',
  maxProse: '65ch',
  maxScreenSm: '640px',
  maxScreenMd: '768px',
  maxScreenLg: '1024px',
  maxScreenXl: '1280px',
  maxScreen2xl: '1536px',
} as const;

export type Radii = keyof typeof radii;
const radii = {
  none: '0px',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.375rem',
  xl: '0.5rem',
  '2xl': '0.75rem',
  '3xl': '1rem',
  '4xl': '1.5rem',
  full: '9999px',
} as const;

export type FontSize = keyof typeof fontSizes;
const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
} as const;

export type Font = keyof typeof fonts;
const fonts = {
  sans: [
    '"Work Sans"',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ].join(', '),
} as const;

export type FontWeight = keyof typeof fontWeights;
const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export type LineHeight = keyof typeof lineHeights;
const lineHeights = {
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',

  // Typeface related defaults
  xs: '1rem',
  sm: '1.25rem',
  base: '1.5rem',
  lg: '1.75rem',
  xl: '1.75rem',
  '2xl': '2rem',
  '3xl': '2.25rem',
  '4xl': '2.5rem',
  '5xl': '1',
  '6xl': '1',
  '7xl': '1',
  '8xl': '1',
  '9xl': '1',
} as const;

export type LetterSpacing = keyof typeof letterSpacings;
const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export type ZIndex = keyof typeof zIndices;
const zIndices = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 'auto',
} as const;

export type Shadow = keyof typeof shadows;
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: '0 0 #0000',
} as const;

export type BorderWidth = keyof typeof borderWidths;
const borderWidths = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

export type BorderStyle = keyof typeof borderStyles;
const borderStyles = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none',
} as const;

export type Color = keyof typeof colors;
const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  black: 'hsl(220deg 9% 5%)',
  white: 'hsl(0deg 0% 100%)',
  gray50: 'hsl(210deg 20% 98%)',
  gray100: 'hsl(220deg 14% 96%)',
  gray200: 'hsl(220deg 13% 91%)',
  gray300: 'hsl(220deg 12% 84%)',
  gray400: 'hsl(220deg 11% 65%)',
  gray500: 'hsl(220deg 9% 46%)',
  blue500: 'hsl(220deg 91% 60%)',
  blue600: 'hsl(220deg 83% 53%)',
  blue700: 'hsl(220deg 76% 48%)',
  red300: 'hsl(0deg 94% 82%)',
  red500: 'hsl(0deg 84% 60%)',
  red700: 'hsl(0deg 74% 42%)',
  red800: 'hsl(0deg 70% 35%)',
  yellow500: 'hsl(38deg 92% 50%)',
  yellow800: 'hsl(23deg 82% 31%)',
  green500: 'hsl(160deg 84% 39%)',
  green800: 'hsl(163deg 88% 20%)',
};

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({
  theme: {
    colors,
    space,
    sizes,
    radii,
    fontSizes,
    fonts,
    fontWeights,
    lineHeights,
    letterSpacings,
    zIndices,
    shadows,
    borderWidths,
    borderStyles,
  },
  media,
  utils: {
    text: (value: Accessor<Extract<LineHeight, FontSize>>) => ({ fontSize: value, lineHeight: value }),
    size: (value: Accessor<Size>) => ({ width: value, height: value }),

    mx: (value: Accessor<Space> | 'auto') => ({ marginLeft: value, marginRight: value }),
    my: (value: Accessor<Space>) => ({ marginTop: value, marginBottom: value }),
    px: (value: Accessor<Space>) => ({ paddingLeft: value, paddingRight: value }),
    py: (value: Accessor<Space>) => ({ paddingTop: value, paddingBottom: value }),

    roundedTop: (value: Accessor<Radii>) => ({ borderTopLeftRadius: value, borderTopRightRadius: value }),
    roundedBottom: (value: Accessor<Radii>) => ({ borderBottomLeftRadius: value, borderBottomRightRadius: value }),
    roundedRight: (value: Accessor<Radii>) => ({ borderTopRightRadius: value, borderBottomRightRadius: value }),
    roundedLeft: (value: Accessor<Radii>) => ({ borderTopLeftRadius: value, borderBottomLeftRadius: value }),

    borderT: (value: Accessor<BorderWidth>) => ({ borderTop: value }),
    borderB: (value: Accessor<BorderWidth>) => ({ borderBottom: value }),
    borderL: (value: Accessor<BorderWidth>) => ({ borderLeft: value }),
    borderR: (value: Accessor<BorderWidth>) => ({ borderRight: value }),

    spaceX: (value: Accessor<Space>) => ({ '& > * + *': { marginLeft: value } }),
    spaceY: (value: Accessor<Space>) => ({ '& > * + *': { marginTop: value } }),
    divideX: (value: Accessor<BorderWidth>) => ({
      '& > * + *': { borderRightWidth: value },
    }),
    divideY: (value: Accessor<BorderWidth>) => ({
      '& > * + *': { borderTopWidth: value },
    }),

    inset: (value: Accessor<Size>) => ({ top: value, right: value, bottom: value, left: value }),

    trans: (value: string) => ({
      transitionProperty: value,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDUration: '150ms',
    }),

    outline: (value: Accessor<Color> | 'none') =>
      value === 'none'
        ? { outline: 'none' }
        : {
            outline: value === '$transparent' ? '2px solid transparent' : `2px dotted ${value}`,
            outlineOffset: '2px',
          },
  } as const,
});
