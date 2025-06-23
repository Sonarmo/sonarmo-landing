import tarteaucitron from "tarteaucitronjs";

export function initCookieBanner() {
  tarteaucitron.init({
    privacyUrl: "/cgu",
    orientation: "bottom",
    showAlertSmall: true,
    cookieslist: true,
    AcceptAllCta: true,
    DenyAllCta: true,
    highPrivacy: true,
    handleBrowserDNTRequest: false,
    removeCredit: true,
    useExternalCss: true, // car tu l’as chargé dans _app.js
    readmoreLink: "/cgu",
    debug: false, // tu peux mettre true pour tester
  });

  tarteaucitron.services.googleanalytics = {
    key: "googleanalytics",
    type: "analytic",
    name: "Google Analytics",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    cookies: ["_ga", "_gid", "_gat"],
    js: function () {
      const gtagScript = document.createElement("script");
      gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N"; // remplace par ton ID
      gtagScript.async = true;
      document.head.appendChild(gtagScript);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      gtag("js", new Date());
      gtag("config", "G-PTGDLQ7W2N"); // remplace par ton ID
    },
  };

  tarteaucitron.job = tarteaucitron.job || [];
  tarteaucitron.job.push("googleanalytics");
}