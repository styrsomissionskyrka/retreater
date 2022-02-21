import theme from './theme.json';

type ThemeSettingKey = 'color' | 'gradient' | 'fontSize';

const palette = theme.settings.color.palette;
const gradients = theme.settings.color.gradients;
const fontSize = theme.settings.typography.fontSizes;

export function get(type: ThemeSettingKey, name?: string, fallback?: string | undefined): string | undefined {
  if (name == null) return undefined;

  if (type === 'color') {
    return palette.find((color) => color.slug === name)?.color ?? fallback;
  }

  if (type === 'gradient') {
    return gradients.find((gradient) => gradient.slug === name)?.gradient ?? fallback;
  }

  if (type === 'fontSize') {
    return fontSize.find((size) => size.slug === name)?.size ?? fallback;
  }
}
