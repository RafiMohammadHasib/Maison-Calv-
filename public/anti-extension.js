/**
 * Anti-Browser-Extension DOM & Hydration Shield for Maison Calvé
 *
 * Prevents third-party browser extensions (e.g. Bitdefender Anti-tracker, Grammarly, ColorZilla)
 * from injecting unwanted DOM attributes (e.g. bis_skin_checked="1") prior to React hydration.
 * Runs synchronously in <head> before React or page scripts execute.
 */
(function () {
  if (typeof window === "undefined") return;

  var EXTENSION_ATTRS = [
    "bis_skin_checked",
    "bis_register",
    "bis_use",
    "data-gramm",
    "cz-shortcut-listen",
    "fdprocessedid",
    "data-dynamic-id",
    "data-config"
  ];

  function cleanElement(el) {
    if (!el || el.nodeType !== 1) return;
    for (var i = 0; i < EXTENSION_ATTRS.length; i++) {
      if (el.hasAttribute(EXTENSION_ATTRS[i])) {
        el.removeAttribute(EXTENSION_ATTRS[i]);
      }
    }
  }

  function cleanTree(node) {
    if (!node || node.nodeType !== 1) return;
    cleanElement(node);
    var children = node.children;
    if (children) {
      for (var i = 0; i < children.length; i++) {
        cleanTree(children[i]);
      }
    }
  }

  // 1. Intercept Element.prototype.setAttribute to block extension attributes in page context
  try {
    var origSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, val) {
      if (EXTENSION_ATTRS.indexOf(name) !== -1) {
        return;
      }
      return origSetAttribute.apply(this, arguments);
    };
  } catch (e) {}

  // 2. Real-time pre-hydration MutationObserver to immediately strip extension attributes from the DOM
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes") {
          if (EXTENSION_ATTRS.indexOf(m.attributeName) !== -1) {
            m.target.removeAttribute(m.attributeName);
          }
        } else if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) {
            cleanTree(m.addedNodes[j]);
          }
        }
      }
    });

    try {
      if (document.documentElement) {
        observer.observe(document.documentElement, {
          attributes: true,
          subtree: true,
          childList: true,
          attributeFilter: EXTENSION_ATTRS
        });
      }
    } catch (e) {}

    // Clean DOM once fully parsed
    if (typeof document !== "undefined") {
      document.addEventListener("DOMContentLoaded", function () {
        cleanTree(document.documentElement);
      });
    }
  }

  // 3. Intercept console.error to prevent browser-extension attribute mismatches from triggering Next.js Dev Overlay
  try {
    var origConsoleError = console.error;
    console.error = function () {
      var isExtensionMismatch = false;
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === "string") {
          if (
            arg.indexOf("bis_skin_checked") !== -1 ||
            arg.indexOf("bis_register") !== -1 ||
            arg.indexOf("data-gramm") !== -1 ||
            arg.indexOf("cz-shortcut-listen") !== -1 ||
            (arg.indexOf("hydration-mismatch") !== -1 && arg.indexOf("bis_skin_checked") !== -1)
          ) {
            isExtensionMismatch = true;
            break;
          }
        } else if (arg && typeof arg === "object") {
          try {
            var str = JSON.stringify(arg);
            if (str.indexOf("bis_skin_checked") !== -1 || str.indexOf("bis_register") !== -1) {
              isExtensionMismatch = true;
              break;
            }
          } catch (e) {}
        }
      }

      if (isExtensionMismatch) {
        // Suppress browser-extension false positive hydration warning
        return;
      }

      return origConsoleError.apply(console, arguments);
    };
  } catch (e) {}
})();

