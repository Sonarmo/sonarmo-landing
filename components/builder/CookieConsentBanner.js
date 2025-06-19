import { useEffect } from "react";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: "#000000",
          text: "#ffffff",
        },
        button: {
          background: "#F28500",
          text: "#000000",
        },
      },
      theme: "classic",
      position: "bottom-center",
      type: "opt-in", // important pour afficher Refuser
      content: {
        message:
          "Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.",
        dismiss: "Accepter",
        deny: "Refuser",
        link: "En savoir plus",
        href: "/cgu",
      },
    });
  }, []);

  return null;
}