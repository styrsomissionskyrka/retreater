import { canUseDOM } from './dom';

export function setGlobalVariable(varName: string, value: string) {
  if (canUseDOM()) {
    let root = document.documentElement;
    root.style.setProperty(varName, value);
  }
}
