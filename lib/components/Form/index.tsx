import dynamic from 'next/dynamic';

export * from './Ui';

export const Markdown = dynamic(() => import('./Markdown'));
