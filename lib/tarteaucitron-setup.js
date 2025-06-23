export function initCookieBanner() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const tarteaucitron = window.tarteaucitron;
  if (!tarteaucitron) return;

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
    useExternalCss: false,
    readmoreLink: "/cgu",
    debug: true,
  });

  tarteaucitron.services.googleanalytics = {
    key: "googleanalytics",
    type: "analytic",
    name: "Google Analytics",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    cookies: ["_ga", "_gid", "_gat"],
    js: function () {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      (function (i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        i[r] =
          i[r] ||
          function () {
            (i[r].q = i[r].q || []).push(arguments);
          };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        "script",
        "https://www.google-analytics.com/analytics.js",
        "ga"
      );

      ga("create", "G-PTGDLQ7W2N", "auto");
      ga("send", "pageview");
    },
  };

  tarteaucitron.job = tarteaucitron.job || [];
  tarteaucitron.job.push("googleanalytics");
}