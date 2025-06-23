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

  // Pageview pour les route changes (si GA est initialisé)
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", { page_path: url });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (isDashboard ? (
    <PlayerProvider><DashboardLayout><AppContents /></DashboardLayout></PlayerProvider>
  ) : (
    <AppContents />
  ));
}

function AppContents() {
  return (
    <>
      <Head>
        <title>Sonarmo</title>
        <link rel="icon" href="/sonarmo-experience.png" />
      </Head>

      {/* CookieYes Banner */}
      <Script
        id="cookieyes"
        strategy="afterInteractive"
        src="https://cdn-cookieyes.com/client_data/c09dfc653764ff663ca49778/script.js"
      />

      {/* Handler : injecte GA après consentement analytics */}
      <Script id="cookieyes-ga-handler" strategy="afterInteractive">
        {`
          window.cookieyesCallbacks = window.cookieyesCallbacks || [];
          window.cookieyesCallbacks.push(function () {
            console.log('🎛️ CookieYes consent:', CookieYes.consent);
            if (CookieYes.consent.analytics) {
              console.log('✅ Analytics autorisé : on charge GA...');
              const s = document.createElement('script');
              s.src = "https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N";
              s.async = true;
              document.head.appendChild(s);
              s.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                window.gtag = gtag;
                window.gtag('js', new Date());
                window.gtag('config', 'G-PTGDLQ7W2N', { anonymize_ip: true });
                console.log('📈 Google Analytics chargé');
              };
            } else {
              console.log('❌ Analytics refusé ou non autorisé');
            }
          });
        `}
      </Script>

      <Component {...(Component.pageProps ?? {})} />
    </>
  );
}

export default MyApp;