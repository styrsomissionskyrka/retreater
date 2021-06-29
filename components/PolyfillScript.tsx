import Script from 'next/script';

const features = [
  'Array.prototype.flat',
  'Array.prototype.flatMap',
  'IntersectionObserver',
  'IntersectionObserverEntry',
  'Intl.DateTimeFormat.~locale.sv',
  'Intl.DateTimeFormat',
  'Intl.getCanonicalLocales',
  'Intl.Locale',
  'Intl.NumberFormat.~locale.sv',
  'Intl.NumberFormat',
  'Intl.PluralRules.~locale.sv',
  'Intl.PluralRules',
  'requestAnimationFrame',
  'requestIdleCallback',
].join(',');

const src = new URL('https://polyfill.io/v3/polyfill.min.js');
src.searchParams.set('features', features);

export const PolyfillScript: React.FC = () => {
  return <Script src={src.toString()} strategy="beforeInteractive" />;
};
