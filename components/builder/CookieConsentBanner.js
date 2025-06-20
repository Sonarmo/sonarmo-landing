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
  layout: "basic", // ou 'categories' si tu veux que les choix soient visibles dès la bannière
  content: {
    message: "Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.",
    allow: "Tout accepter",
    deny: "Tout refuser",
    link: "Paramétrer mes choix",
    href: "#",
  },
  elements: {
    allow: '<button type="button" class="cc-btn cc-allow">{{allow}}</button>',
    deny: '<button type="button" class="cc-btn cc-deny">{{deny}}</button>',
    link: '<a aria-label="learn more about cookies" class="cc-link" href="#" data-cc="c-settings">{{link}}</a>',
  },
  settings: {
    // Active le panneau de gestion des catégories
    layout: "categories",
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