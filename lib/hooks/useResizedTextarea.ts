import React, { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

interface ResizedTextareaOptions {
  minRows?: number;
  maxRows?: number;
}

/**
 * This is a hook version of `react-textarea-autosize`.
 *
 * @link https://github.com/Andarist/react-textarea-autosize
 *
 * @param ref Textare ref object
 * @param minRows Min rows height
 */
export function useResizedTextarea(ref: React.RefObject<HTMLTextAreaElement>, options: ResizedTextareaOptions = {}) {
  const heightRef = useRef(0);
  const measurementsCacheRef = useRef<SizingData>();

  useIsomorphicLayoutEffect(() => {
    if (ref.current == null) return;
    const node = ref.current;

    const resizeTextarea = () => {
      const nodeSizingData = getSizingData(node);
      if (!nodeSizingData) return;
      measurementsCacheRef.current = nodeSizingData;

      const [height] = calculateNodeHeight(
        nodeSizingData,
        node.value || node.placeholder || 'x',
        options.minRows,
        options.maxRows,
      );

      if (heightRef.current !== height) {
        heightRef.current = height;
        node.style.setProperty('height', `${height}px`, 'important');
      }
    };

    resizeTextarea();
    node.addEventListener('input', resizeTextarea);
    return () => {
      node.removeEventListener('input', resizeTextarea);
    };
  }, [options.maxRows, options.minRows, ref]);
}

const SIZING_STYLE = [
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'boxSizing',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  // non-standard
  'tabSize',
  'textIndent',
  // non-standard
  'textRendering',
  'textTransform',
  'width',
  'wordBreak',
] as const;

type SizingProps = Extract<typeof SIZING_STYLE[number], keyof CSSStyleDeclaration>;

type SizingStyle = Pick<CSSStyleDeclaration, SizingProps>;

type SizingData = {
  sizingStyle: SizingStyle;
  paddingSize: number;
  borderSize: number;
};

function getSizingData(node: HTMLElement): SizingData | null {
  const style = window.getComputedStyle(node);

  if (style === null) {
    return null;
  }

  const sizingStyle = pick(SIZING_STYLE as unknown as SizingProps[], style);
  const { boxSizing } = sizingStyle;

  // probably node is detached from DOM, can't read computed dimensions
  if (boxSizing === '') {
    return null;
  }

  const paddingSize = parseFloat(sizingStyle.paddingBottom!) + parseFloat(sizingStyle.paddingTop!);

  const borderSize = parseFloat(sizingStyle.borderBottomWidth!) + parseFloat(sizingStyle.borderTopWidth!);

  return {
    sizingStyle,
    paddingSize,
    borderSize,
  };
}

function pick<Obj extends { [key: string]: any }, Key extends keyof Obj>(props: Key[], obj: Obj): Pick<Obj, Key> {
  return props.reduce((acc, prop) => {
    acc[prop] = obj[prop];
    return acc;
  }, {} as Pick<Obj, Key>);
}
type CalculatedNodeHeights = number[];

let hiddenTextarea: HTMLTextAreaElement | null = null;

const getHeight = (node: HTMLElement, sizingData: SizingData): number => {
  const height = node.scrollHeight;

  if (sizingData.sizingStyle.boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize;
};

function calculateNodeHeight(
  sizingData: SizingData,
  value: string,
  minRows = 1,
  maxRows = Infinity,
): CalculatedNodeHeights {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tabindex', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    forceHiddenStyles(hiddenTextarea);
  }

  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }

  const { paddingSize, borderSize, sizingStyle } = sizingData;
  const { boxSizing } = sizingStyle;

  Object.keys(sizingStyle).forEach((_key) => {
    const key = _key as keyof typeof sizingStyle;
    hiddenTextarea!.style[key] = sizingStyle[key] as any;
  });

  forceHiddenStyles(hiddenTextarea);

  hiddenTextarea.value = value;
  let height = getHeight(hiddenTextarea, sizingData);

  // measure height of a textarea with a single row
  hiddenTextarea.value = 'x';
  const rowHeight = hiddenTextarea.scrollHeight - paddingSize;

  let minHeight = rowHeight * minRows;
  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);

  let maxHeight = rowHeight * maxRows;
  if (boxSizing === 'border-box') {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  height = Math.min(maxHeight, height);

  return [height, rowHeight];
}

const HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
} as const;

function forceHiddenStyles(node: HTMLElement) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach((key) => {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key as keyof typeof HIDDEN_TEXTAREA_STYLE], 'important');
  });
}
