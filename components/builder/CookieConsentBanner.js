import { useEffect } from "react";
import { initCookieBanner } from "/lib/tarteaucitron-setup";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLoad = () => {
      const tryInit = () => {
        if (window.tarteaucitron && typeof window.tarteaucitron.init === "function") {
          console.log("✅ tarteaucitron prêt, initialisation en cours");
          initCookieBanner();
        } else {
          console.log("⏳ En attente de tarteaucitron...");
          setTimeout(tryInit, 500);
        }
      };

      tryInit();
    };

    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
}