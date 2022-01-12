import theme from './theme.json';

type ThemeSettingKey = 'color' | 'fontSize';

const palette = theme.settings.color.palette;
const fontSize = theme.settings.typography.fontSizes;

export function get(
  type: ThemeSettingKey,
  name?: string,
  fallback?: string | undefined,
): string | undefined {
  if (type === 'color') {
    return palette.find((color) => color.slug === name)?.color ?? fallback;
  }

  if (type === 'fontSize') {
    return fontSize.find((size) => size.slug === name)?.size ?? fallback;
  }
}
