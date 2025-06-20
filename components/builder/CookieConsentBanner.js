import { useEffect } from "react";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const launchTarte = () => {
      console.log("✅ tarteaucitron.init lancé après window.load");

      window.tarteaucitron.init({
        privacyUrl: "/cgu",
        orientation: "bottom",
        showAlertSmall: true,
        cookieslist: true,
        AcceptAllCta: true,
        DenyAllCta: true,
        highPrivacy: true,
        handleBrowserDNTRequest: false,
        removeCredit: true,
        useExternalCss: false,
        readmoreLink: "/cgu",
        debug: true,
      });

      // (Tu pourras remettre GA ici après si tu veux)
    };

    if (window.tarteaucitron) {
      // on attend l'événement window.load avant d'init
      window.addEventListener("load", launchTarte);
    } else {
      // si le script n'est pas encore chargé, on réessaie
      const interval = setInterval(() => {
        if (window.tarteaucitron) {
          clearInterval(interval);
          window.addEventListener("load", launchTarte);
        }
      }, 100);
    }

    // cleanup
    return () => {
      window.removeEventListener("load", launchTarte);
    };
  }, []);

  return null;
}