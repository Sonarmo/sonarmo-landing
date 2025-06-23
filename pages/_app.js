// pages/_app.js
import "/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "/components/builder/DashboardLayout";
import CookieConsentBanner from "/components/builder/CookieConsentBanner";
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

        {/* ✅ TarteAuCitron CSS CORRIGÉ */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.13.0/css/tarteaucitron.css"
        />
      </Head>

      {/* ✅ Script TarteAuCitron */}
      <Script
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.13.0/tarteaucitron.js"
      />

      {/* ✅ Initialise le bandeau cookie */}
      <CookieConsentBanner />

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