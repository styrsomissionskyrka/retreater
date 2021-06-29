import { useState, useEffect, useRef } from 'react';

type OnUpdateCallback = (entry: IntersectionObserverEntry) => void;

type UseIntersectionOptions = {
  options: IntersectionObserverInit;
  onUpdate: OnUpdateCallback;
};

export function useIntersection(ref: React.RefObject<HTMLElement>, options?: UseIntersectionOptions) {
  const [intersection, setIntersection] = useState<IntersectionObserverEntry | null>(null);
  const optionsRef = useRef(options?.options);
  const onUpdateRef = useRef(options?.onUpdate);

  useEffect(() => {
    onUpdateRef.current = options?.onUpdate;
  });

  useEffect(() => {
    if (ref.current == null) return;
    let element = ref.current;

    let callback: IntersectionObserverCallback = (entries) => {
      for (let entry of entries) {
        if (entry.target === ref.current) {
          setIntersection(entry);
          if (onUpdateRef.current != null) onUpdateRef.current(entry);
          break;
        }
      }
    };

    let observer = new IntersectionObserver(callback, optionsRef.current);

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [ref]);

  return intersection;
}
