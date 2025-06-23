import { useEffect } from "react";
import { initCookieBanner } from "/lib/tarteaucitron-setup";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tryInit = () => {
      if (window.tarteaucitron && typeof window.tarteaucitron.init === "function") {
        console.log("✅ tarteaucitron prêt, initialisation en cours");
        initCookieBanner();
      } else {
        console.log("⏳ En attente de tarteaucitron...");
        setTimeout(tryInit, 300); // ⏱️ relance rapide
      }
    };

    // Lance une fois le chargement de la page terminé
    window.addEventListener("load", tryInit);

    return () => {
      window.removeEventListener("load", tryInit);
    };
  }, []);

  return null;
}