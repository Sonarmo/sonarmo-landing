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

  // 📊 Suivi de page GA (si injecté)
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

  // 🍪 Injecte GA si CookieYes analytics accepté
  useEffect(() => {
    function injectGA() {
      if (window.gtag) return; // Évite doublons
      const script1 = document.createElement("script");
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N";
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PTGDLQ7W2N', { anonymize_ip: true });
      `;
      document.head.appendChild(script2);

      console.log("✅ Google Analytics injecté");
    }

    const interval = setInterval(() => {
      if (window.CookieYes && window.CookieYes.consent) {
        if (window.CookieYes.consent.analytics) {
          injectGA();
        }
        clearInterval(interval);
      }
    }, 300);

    setTimeout(() => clearInterval(interval), 8000); // Timeout
  }, []);

  const page = (
    <>
      <Head>
        <title>Sonarmo</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>

      {/* ✅ CookieYes */}
      <Script
        id="cookieyes"
        strategy="afterInteractive"
        src="https://cdn-cookieyes.com/client_data/c09dfc653764ff663ca49778/script.js"
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