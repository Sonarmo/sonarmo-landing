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
         {/* ✅ Plausible Analytics avec options */}
        <script
          defer
          data-domain="www.sonarmo.com"
          src="https://plausible.io/js/script.outbound-links.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function() {
                (window.plausible.q = window.plausible.q || []).push(arguments);
              }
            `,
          }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}