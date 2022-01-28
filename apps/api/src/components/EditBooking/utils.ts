import { useLazyInit } from '@fransvilhelm/hooks';

export function useExistingPortal(id: string) {
  return useLazyInit(() => {
    let el = document.getElementById(id);
    if (el) el.innerHTML = '';
    return el;
  });
}
