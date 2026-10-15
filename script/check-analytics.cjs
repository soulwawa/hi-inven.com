// No Google requests: run the production script against an in-memory DOM.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");
const source = fs.readFileSync(__dirname + "/../assets/js/analytics.js", "utf8");
const id = "G-TEST000000";
const storeUrl = "https://apps.apple.com/kr/app/id6802033161";

function boot({ url = "https://hi-inven.com/blog/?email=private@example.com#token", saved,
  referrer = "https://search.example/private?token=secret#account", measurementId = id,
  blockedStorage = false } = {}) {
  const handlers = {};
  const scripts = [];
  const cookies = [];
  const values = new Map(saved ? [["hi-inven.web-analytics.v1", saved]] : []);
  const element = (name, dataset = {}) => ({
    hidden: true, dataset,
    focus() { context.document.activeElement = this; },
    addEventListener(type, fn) { handlers[name + ":" + type] = fn; }
  });
  const settings = element("settings");
  const denied = element("denied", { analyticsChoice: "denied" });
  const granted = element("granted", { analyticsChoice: "granted" });
  const banner = element("banner");
  banner.querySelector = () => denied;
  banner.querySelectorAll = () => [denied, granted];
  const config = { dataset: { measurementId, pageUrl: "https://hi-inven.com/blog/", storeUrl } };
  const location = new URL(url);
  let reloads = 0;
  location.reload = () => { reloads++; };
  const document = {
    referrer,
    getElementById: name => name === "site-analytics" ? config : banner,
    querySelector: () => settings,
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
    addEventListener: (type, fn) => { handlers["document:" + type] = fn; },
    set cookie(value) { cookies.push(value); }
  };
  const context = vm.createContext({
    URL, URLSearchParams, location, document,
    localStorage: {
      getItem(key) { if (blockedStorage) throw new Error("blocked"); return values.get(key); },
      setItem(key, value) { if (blockedStorage) throw new Error("blocked"); values.set(key, value); }
    },
    addEventListener(type, fn) { handlers["window:" + type] = fn; }
  });
  context.window = context;
  const run = () => vm.runInContext(source, context);
  run();
  const calls = () => Array.from(context.dataLayer || [], call => JSON.parse(JSON.stringify(Array.from(call))));
  return {
    context, scripts, cookies, banner, settings, values, calls, run,
    reloads: () => reloads,
    choose: choice => handlers[choice + ":click"](),
    open: () => handlers["settings:click"](),
    storage: value => handlers["window:storage"]({ key: "hi-inven.web-analytics.v1", newValue: value }),
    click(href, type = "click", button = 0, defaultPrevented = false) {
      handlers["document:" + type]({ type, button, defaultPrevented,
        target: { closest: () => href ? { href } : null } });
    }
  };
}

test("no tag or events before consent, after refusal, or after a persisted refusal", () => {
  const page = boot();
  assert.equal(page.banner.hidden, false);
  page.click(storeUrl);
  page.choose("denied");
  page.click(storeUrl);
  assert.deepEqual(page.calls(), []);
  assert.deepEqual(page.scripts, []);
  assert.equal(page.values.get("hi-inven.web-analytics.v1"), "denied");
  const denied = boot({ saved: "denied" });
  assert.equal(denied.banner.hidden, true);
  assert.deepEqual(denied.calls(), []);
});

test("allow loads one tag/config with sanitized addresses and no advertising or normal debug flag", () => {
  const page = boot();
  page.choose("granted");
  page.choose("granted");
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].referrerPolicy, "strict-origin");
  const configs = page.calls().filter(call => call[0] === "config");
  assert.equal(configs.length, 1);
  assert.equal(configs[0][1], id);
  const options = configs[0][2];
  assert.equal(options.page_location, "https://hi-inven.com/blog/");
  assert.equal(options.page_referrer, "https://search.example/");
  assert.equal(options.send_page_view, false);
  assert.equal(page.calls().filter(call => call[0] === "event" && call[1] === "page_view").length, 1);
  assert.equal(options.allow_google_signals, false);
  assert.equal(options.allow_ad_personalization_signals, false);
  assert.equal("debug_mode" in options, false);
  assert.equal(JSON.stringify(page.calls()).includes("private"), false);
  assert.equal(JSON.stringify(page.calls()).includes("secret"), false);
  assert.deepEqual(page.calls()[0], ["consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied"
  }]);
});

test("only exact approved App Store destination clicks are sent once with a fixed safe URL", () => {
  const page = boot({ saved: "granted" });
  page.click(storeUrl + "?token=secret#private");
  page.click(storeUrl, "auxclick", 1);
  for (const href of ["https://apps.apple.com/kr/app/id68020331612", "https://apps.apple.com.evil/kr/app/id6802033161",
    "https://apps.apple.com/kr/app/id123", "https://apps.apple.com/us/app/name/id6802033161",
    "http://apps.apple.com/kr/app/id6802033161", "mailto:private@example.com", null]) page.click(href);
  page.click(storeUrl, "auxclick", 2);
  page.click(storeUrl, "click", 0, true);
  const events = page.calls().filter(call => call[0] === "event" && call[1] === "click");
  assert.equal(events.length, 2);
  assert.deepEqual(events[0], ["event", "click", {
    send_to: id, link_domain: "apps.apple.com", link_url: storeUrl, outbound: true
  }]);
});

test("local/preview/wrong protocol/invalid ID never load the production tag", () => {
  for (const url of ["http://localhost:4000/", "https://preview.hi-inven.com/", "https://www.hi-inven.com/", "http://hi-inven.com/"]) {
    const page = boot({ url, saved: "granted" });
    assert.equal(page.scripts.length, 0);
    assert.deepEqual(page.calls(), []);
    assert.equal(page.settings.hidden, true);
  }
  for (const measurementId of ["", "G-EXAMPLE", "GTM-TEST000000"]) {
    assert.equal(boot({ measurementId, saved: "granted" }).scripts.length, 0);
  }
});

test("debug is opt-in and removed from the reported page; empty/non-web referrers are omitted", () => {
  for (const value of ["1", "0"]) {
    const page = boot({ saved: "granted", url: "https://hi-inven.com/?analytics_debug=" + value, referrer: "file:///private" });
    const options = page.calls().find(call => call[0] === "config")[2];
    assert.equal("debug_mode" in options, value === "1");
    assert.equal(options.page_referrer, "");
    assert.equal(options.page_location.includes("?"), false);
  }
});

test("reopened choice and cross-tab withdrawal disable the tag, clear only GA cookies and reload", () => {
  const page = boot({ saved: "granted" });
  page.open();
  assert.equal(page.banner.hidden, false);
  const before = page.calls().length;
  page.choose("denied");
  assert.equal(page.context["ga-disable-" + id], true);
  assert.equal(page.reloads(), 1);
  page.click(storeUrl);
  assert.equal(page.calls().length, before);
  assert.equal(page.cookies.length, 4);
  assert.ok(page.cookies.every(cookie => cookie.startsWith("_ga=" ) || cookie.startsWith("_ga_TEST000000=")));
  const other = boot({ saved: "granted" });
  other.storage("denied");
  assert.equal(other.reloads(), 1);
  assert.equal(other.context["ga-disable-" + id], true);
});

test("blocked storage does not break the current-page choice or future denial", () => {
  const page = boot({ blockedStorage: true });
  page.choose("granted");
  assert.equal(page.scripts.length, 1);
  page.choose("denied");
  assert.equal(page.context["ga-disable-" + id], true);
  assert.equal(page.reloads(), 1);
});
