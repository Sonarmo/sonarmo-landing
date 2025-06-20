// pages/_app.js
import "/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "/components/builder/DashboardLayout";
import CookieConsentBanner from "/components/builder/CookieConsentBanner"; // nouvelle version avec TarteAuCitron
import { PlayerProvider } from "/lib/contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

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

        {/* TarteAuCitron CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tarteaucitronjs/1.9.6/tarteaucitron.min.css"
        />
      </Head>

      {/* TarteAuCitron JS */}
      <Script
        strategy="afterInteractive"
        src="https://cdnjs.cloudflare.com/ajax/libs/tarteaucitronjs/1.9.6/tarteaucitron.min.js"
      />

      {/* Initialise TarteAuCitron via React */}
      <CookieConsentBanner />

      {/* Google Analytics - activé uniquement si accepté */}
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
              if (window.tarteaucitron?.user?.googleanalytics === true) {
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