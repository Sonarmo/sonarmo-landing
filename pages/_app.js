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

  // Suivi des pages (si GA est activé)
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", { page_path: url });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // ✅ App content avec props bien transmis
  const AppContents = () => (
    <>
      <Head>
        <title>Sonarmo</title>
        <link rel="icon" href="/sonarmo-experience.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* CookieYes Banner */}
      <Script
        id="cookieyes"
        strategy="afterInteractive"
        src="https://cdn-cookieyes.com/client_data/c09dfc653764ff663ca49778/script.js"
      />

      {/* Google Analytics chargé après consentement */}
      <Script id="cookieyes-ga-handler" strategy="afterInteractive">
        {`
          window.cookieyesCallbacks = window.cookieyesCallbacks || [];
          window.cookieyesCallbacks.push(function () {
            if (CookieYes?.consent?.analytics) {
              const s = document.createElement('script');
              s.src = "https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N";
              s.async = true;
              document.head.appendChild(s);
              s.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'G-PTGDLQ7W2N', { anonymize_ip: true });
              };
            }
          });
        `}
      </Script>

      {/* Page rendering */}
      <Component {...pageProps} />
    </>
  );

  return isDashboard ? (
    <PlayerProvider>
      <DashboardLayout>
        <AppContents />
      </DashboardLayout>
    </PlayerProvider>
  ) : (
    <AppContents />
  );
}

export default MyApp;