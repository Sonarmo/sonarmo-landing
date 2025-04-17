
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Tu peux aussi ajouter une meta pour le mobile ici plus tard */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
