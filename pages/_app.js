import "/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "/components/builder/DashboardLayout";
import { PlayerProvider } from "/lib/contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  const [cookieAccepted, setCookieAccepted] = useState(false);

  // Vérifie le consentement au chargement
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "true") {
      setCookieAccepted(true);
      loadAnalytics();
    }
  }, []);

  // Injecte GA
  const loadAnalytics = () => {
    if (typeof window === "undefined") return;

    // Script gtag.js
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    // Script config GA
    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PTGDLQ7W2N', { anonymize_ip: true });
    `;
    document.head.appendChild(inlineScript);
  };

  // Appelé au clic sur "Accepter"
  const handleAcceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setCookieAccepted(true);
    loadAnalytics();
  };

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

      {/* ✅ Bannière cookie maison */}
      {!cookieAccepted && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#000",
            color: "#fff",
            padding: "16px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          Nous utilisons des cookies pour améliorer votre expérience.{" "}
          <button
            onClick={handleAcceptCookies}
            style={{
              marginLeft: "12px",
              background: "#F28500",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Accepter
          </button>
        </div>
      )}

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