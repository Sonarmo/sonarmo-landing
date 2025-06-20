import { useEffect } from "react";

export default function CookieConsentBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const injectCustomStyle = () => {
      const style = document.createElement("style");
      style.innerHTML = `
        #tarteaucitronAlertBig {
          background: #000000 !important;
          color: white !important;
          font-family: 'Poppins', sans-serif;
        }
        #tarteaucitronAlertBig .tarteaucitronCTAButton {
          background: linear-gradient(to right, #F28500, #FF00FF) !important;
          border: none !important;
          color: white !important;
          font-weight: 600;
          border-radius: 6px;
          padding: 8px 16px;
          margin: 4px;
          font-size: 0.9rem;
        }
        #tarteaucitronAlertBig a {
          color: #F28500 !important;
          text-decoration: underline;
        }
        .tarteaucitronHidden {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    };

    const initTarteAuCitron = () => {
      if (window.tarteaucitron) {
        injectCustomStyle();

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
        });

        window.tarteaucitron.services.googleanalytics = {
          key: "googleanalytics",
          type: "analytic",
          name: "Google Analytics",
          uri: "https://policies.google.com/privacy",
          needConsent: true,
          cookies: ["_ga", "_gid", "_gat"],
          js: function () {
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

        window.tarteaucitron.job = window.tarteaucitron.job || [];
        window.tarteaucitron.job.push("googleanalytics");
      } else {
        setTimeout(initTarteAuCitron, 100);
      }
    };

    initTarteAuCitron();
  }, []);

  return null;
}