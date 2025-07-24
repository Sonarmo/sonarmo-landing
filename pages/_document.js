import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* ✅ Font Google uniquement */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Umami Analytics */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="d1d25c76-7c9d-4184-98e5-aecf20dd59a0"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}