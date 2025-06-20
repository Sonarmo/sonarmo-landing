import { useEffect } from "react";
import { initCookieBanner } from "/lib/tarteaucitron-setup";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("load", initCookieBanner);
    return () => {
      window.removeEventListener("load", initCookieBanner);
    };
  }, []);

  return null;
}