export function initCookieBanner() {
  const tac = window.tarteaucitron;

  tac.init({
    privacyUrl: "/cgu",
    orientation: "bottom",
    showAlertSmall: false,
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

  tac.services.googleanalytics = {
    key: "googleanalytics",
    type: "analytic",
    name: "Google Analytics",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    cookies: ["_ga", "_gid", "_gat"],
    js: function () {
      window.ga =
        window.ga ||
        function () {
          (ga.q = ga.q || []).push(arguments);
        };
      ga.l = +new Date();
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.google-analytics.com/analytics.js";
      document.head.appendChild(script);

      ga("create", "G-PTGDLQ7W2N", "auto");
      ga("send", "pageview");
    },
  };

  tac.job = tac.job || [];
  tac.job.push("googleanalytics");

  // 🟢 Attendre que l'interface soit totalement chargée
  tac.events.load = function () {
    console.log("✅ Interface TarteAuCitron chargée, ouverture possible.");
    if (!tac.hasConsented("googleanalytics")) {
      tac.userInterface.openPanel();
    }
  };
}