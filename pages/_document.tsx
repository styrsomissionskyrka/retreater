/* eslint-disable @next/next/no-page-custom-font */
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { getCssText } from 'styles/stitches.config';

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link
            key="font"
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
