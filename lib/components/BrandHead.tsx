import Head from 'next/head';

export const BrandHead: React.FC = () => {
  return (
    <Head>
      <link key="icon:favicon" rel="icon" href="/favicon.ico" />
      <link key="icon:svg" rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link key="icon:ap" rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link key="manifest" rel="manifest" href="/manifest.webmanifest" />
    </Head>
  );
};
