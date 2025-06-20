import { useEffect } from "react";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTarte = () => {
      console.log("DEBUG - tarteaucitron présent ?", typeof window.tarteaucitron);

      if (window.tarteaucitron) {
        console.log("DEBUG - Appel init()");

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
          debug: true, // ← AJOUT pour afficher tous les logs
        });

        // Ne rien injecter de GA ici, on veut juste voir la bannière
      } else {
        console.log("DEBUG - tarteaucitron PAS chargé, retrying...");
        setTimeout(checkTarte, 100);
      }
    };

    checkTarte();
  }, []);

  return null;
}