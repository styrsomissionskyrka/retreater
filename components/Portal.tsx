import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from '@fransvilhelm/hooks';

import { useForceUpdate } from 'lib/hooks';

export const Portal: React.FC = ({ children }) => {
  let mountNode = useRef<HTMLDivElement | null>(null);
  let portalNode = useRef<HTMLElement | null>(null);
  let forceUpdate = useForceUpdate();

  useIsomorphicLayoutEffect(() => {
    // This ref may be null when a hot-loader replaces components on the page
    if (!mountNode.current) return;
    // It's possible that the content of the portal has, itself, been portaled.
    // In that case, it's important to append to the correct document element.
    const ownerDocument = mountNode.current!.ownerDocument;
    portalNode.current = ownerDocument?.createElement('smk-portal')!;
    ownerDocument!.body.appendChild(portalNode.current!);
    forceUpdate();

    return () => {
      if (portalNode.current && portalNode.current.ownerDocument) {
        portalNode.current.ownerDocument.body.removeChild(portalNode.current);
      }
    };
  }, [forceUpdate]);

  return portalNode.current ? createPortal(children, portalNode.current) : <span ref={mountNode} />;
};

Portal.displayName = 'Portal';
