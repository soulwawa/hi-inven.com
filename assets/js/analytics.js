(() => {
  "use strict";

  const config = document.getElementById("site-analytics");
  const id = config?.dataset.measurementId;
  if (location.protocol !== "https:" || location.hostname !== "hi-inven.com" ||
      !/^G-[A-Z0-9]{10}$/.test(id || "") || window.hiInvenAnalyticsLoaded) return;
  window.hiInvenAnalyticsLoaded = true;

  const banner = document.getElementById("analytics-consent");
  const settings = document.querySelector("[data-analytics-settings]");
  const consentKey = "hi-inven.web-analytics.v1";
  let consent;
  let started = false;
  try { consent = localStorage.getItem(consentKey); } catch { /* Ask again if storage is unavailable. */ }

  const page = new URL(config.dataset.pageUrl);
  if (page.origin !== "https://hi-inven.com") return;
  const pageUrl = page.origin + page.pathname;
  let referrer = "";
  try {
    const url = new URL(document.referrer);
    if (url.protocol === "https:" || url.protocol === "http:") referrer = url.origin + "/";
  } catch { /* Direct visits have no referrer. */ }

  function start() {
    if (started || consent !== "granted") return;
    started = true;
    window["ga-disable-" + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const adsDenied = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
    window.gtag("consent", "default", { ...adsDenied, analytics_storage: "denied" });
    window.gtag("consent", "update", { ...adsDenied, analytics_storage: "granted" });
    window.gtag("set", { page_location: pageUrl, page_referrer: referrer, ads_data_redaction: true });
    window.gtag("js", new Date());
    const options = {
      send_page_view: false,
      page_location: pageUrl,
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "hi-inven.com"
    };
    if (new URLSearchParams(location.search).get("analytics_debug") === "1") options.debug_mode = true;
    window.gtag("config", id, options);
    window.gtag("event", "page_view", { send_to: id, page_location: pageUrl, page_referrer: referrer });
    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "strict-origin";
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(script);
  }

  function stop() {
    window["ga-disable-" + id] = true;
    // Reload removes the already loaded tag without sending a denied-consent ping.
    for (const name of ["_ga", "_ga_" + id.slice(2)]) {
      document.cookie = name + "=; Max-Age=0; Path=/; Secure; SameSite=Lax";
      document.cookie = name + "=; Max-Age=0; Path=/; Domain=hi-inven.com; Secure; SameSite=Lax";
    }
    location.reload();
  }

  function choose(value) {
    consent = value;
    try { localStorage.setItem(consentKey, value); } catch { /* The current-page choice still applies. */ }
    banner.hidden = true;
    settings.focus();
    if (value === "granted") start();
    else if (started) stop();
  }

  settings.hidden = false;
  settings.addEventListener("click", () => {
    banner.hidden = false;
    banner.querySelector("button").focus();
  });
  banner.querySelectorAll("[data-analytics-choice]").forEach(button => {
    button.addEventListener("click", () => choose(button.dataset.analyticsChoice));
  });
  window.addEventListener("storage", event => {
    if (event.key !== consentKey && event.key !== null) return;
    consent = event.newValue;
    if (consent === "granted") {
      banner.hidden = true;
      start();
    } else if (started) stop();
    else banner.hidden = consent === "denied";
  });

  function storeClick(event) {
    if (consent !== "granted" || event.defaultPrevented ||
        (event.type === "auxclick" && event.button !== 1)) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.origin + url.pathname !== config.dataset.storeUrl) return;
    window.gtag("event", "click", {
      send_to: id,
      link_domain: "apps.apple.com",
      link_url: config.dataset.storeUrl,
      outbound: true
    });
  }
  document.addEventListener("click", storeClick);
  document.addEventListener("auxclick", storeClick);
  banner.hidden = consent === "granted" || consent === "denied";
  start();
})();
