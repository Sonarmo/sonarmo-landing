import { useEffect } from "react";

export default function CookieConsentBanner() {
  useEffect(() => {
    // Assure-toi que le code s'exécute dans le navigateur
    if (typeof window === "undefined") return;

    // Fonction d'initialisation
    const initCookie = () => {
      if (window.cookieconsent) {
     window.cookieconsent.initialise({
  palette: {
    popup: {
      background: "#000000",
      text: "#ffffff",
    },
    button: {
      background: "#F216CA",
      text: "#000000",
    },
  },
  theme: "classic",
  position: "bottom-center",
  type: "opt-in",
  layout: "basic", // ou 'categories' si tu veux afficher les cases directement
  content: {
    message: "Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.",
    allow: "Tout accepter",
    deny: "Tout refuser",
    link: "Paramétrer mes choix",
    href: "#",
  },
  elements: {
    link: '<a class="cc-link" href="#" data-cc="c-settings">{{link}}</a>',
  },
});
      }
    };

    // Attendre que le script soit bien chargé
    if (window.cookieconsent) {
      initCookie();
    } else {
      window.addEventListener("load", initCookie);
    }
  }, []);

  return null;
}