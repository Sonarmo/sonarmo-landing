// pages/_app.js
import "/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "/components/builder/DashboardLayout";
import { PlayerProvider } from "/lib/contexts/PlayerContext";
import CookieConsentBanner from "/components/builder/CookieConsentBanner"; // ← Crée ce fichier

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  // ➤ Suivi des changements de page (pour Analytics)
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window.gtag !== "undefined") {
        window.gtag("config", "G-PTGDLQ7W2N", {
          page_path: url,
        });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const page = (
    <>
      <Head>
        <title>Sonarmo</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
        {/* CookieConsent CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
        />
      </Head>

      {/* CookieConsent JS */}
      <Script
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
      />

      {/* Initialise CookieConsent via React */}
      <CookieConsentBanner />

      {/* Google Analytics - bloqué tant que pas accepté */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            window.addEventListener('load', function() {
              if (window.cookieconsent?.hasConsented?.()) {
                gtag('js', new Date());
                gtag('config', 'G-PTGDLQ7W2N', {
                  page_path: window.location.pathname,
                });
              }
            });
          `,
        }}
      />

      <Component {...pageProps} />
    </>
  );

  const getLayout = isDashboard
    ? (page) => (
        <PlayerProvider>
          <DashboardLayout>{page}</DashboardLayout>
        </PlayerProvider>
      )
    : (page) => page;

  return getLayout(page);
}

export default MyApp;