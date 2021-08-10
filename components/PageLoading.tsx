import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';

import style from './PageLoading.module.css';

const template = `<div class="${style.bar}" role="bar"><div class="${style.peg}"></div></div>`;

export const PageLoading: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, template });

    let timeout: NodeJS.Timeout;

    const handleStart = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => NProgress.start(), 300);
    };
    const handleStop = () => {
      clearTimeout(timeout);
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router.events]);

  return null;
};
