// pages/_app.js
import "/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "/components/builder/DashboardLayout";
import { PlayerProvider } from "/lib/contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  // GA : suivi page view
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
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>

      {/* ✅ Cookiebot */}
      <Script
        id="Cookiebot"
        strategy="beforeInteractive"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="6b424237-bb4c-47c8-8c50-959161d7da5e"
        data-blockingmode="auto"
        type="text/javascript"
      />

      {/* ✅ Google Analytics via Cookiebot */}
      <Script
        id="gtag-script"
        type="text/plain"
        data-cookieconsent="statistics"
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N"
      />
      <Script
        id="gtag-init"
        type="text/plain"
        data-cookieconsent="statistics"
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PTGDLQ7W2N', { anonymize_ip: true });
        `}
      </Script>

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