export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export function setAttribute(el: HTMLElement, attr: string, value: string | null | undefined) {
  if (value) {
    el.setAttribute(attr, value);
  } else {
    el.removeAttribute(attr);
  }
}

export function toggleAttribute(el: HTMLElement, attr: string, force?: boolean) {
  el.toggleAttribute(attr, force);
}
