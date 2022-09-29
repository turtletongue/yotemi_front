import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html dir="ltr">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mitr&family=Mochiy+Pop+One&family=Secular+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
