"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // 1. Prevent browser scroll restoration and ensure reload opens at the top
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force instant scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Handle beforeunload, load, and pageshow (including bfcache back/forward/reload)
    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    };

    window.addEventListener("beforeunload", resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.removeEventListener("beforeunload", resetScroll);
      window.removeEventListener("pageshow", resetScroll);
    };
  }, []);

  // 2. Reset scroll to top on route change across any page in the application (or restore if returning from modal/portal)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pendingScroll = sessionStorage.getItem("mc_login_return_scroll");
    if (pendingScroll !== null) {
      sessionStorage.removeItem("mc_login_return_scroll");
      const targetY = parseFloat(pendingScroll);
      if (!isNaN(targetY)) {
        window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetY, { immediate: true });
        }
        setTimeout(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetY, { immediate: true });
          }
        }, 60);
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // 3. Initialize smooth scrolling on non-touch / non-reduced-motion devices
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    lenisRef.current = lenis;

    // Ensure Lenis starts at scroll position 0
    lenis.scrollTo(0, { immediate: true });

    // Synchronize Lenis with GSAP ScrollTrigger for Awwwards-grade buttery motion
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initialize global scroll-triggered animations
    const initTriggers = () => {
      // 1. Fade up reveals
      const fadeUps = document.querySelectorAll('[data-reveal="fade-up"]');
      fadeUps.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 35, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 2. Staggered card grids
      const staggers = document.querySelectorAll('[data-reveal="stagger"]');
      staggers.forEach((el) => {
        gsap.fromTo(
          el.children,
          { y: 30, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 3. Subtle Parallax for photographic showcase
      const parallaxes = document.querySelectorAll('[data-reveal="parallax"]');
      parallaxes.forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });

      ScrollTrigger.refresh();
    };

    const timer = setTimeout(initTriggers, 120);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);


  // 4. Post-hydration browser extension sanitizer
  // Cleans attributes injected by extensions (Bitdefender bis_skin_checked, Grammarly, etc.)
  // Runs strictly post-hydration in useEffect so React hydration completes with 100% fidelity.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const extensionAttrs = [
      "bis_skin_checked",
      "bis_register",
      "data-gramm",
      "cz-shortcut-listen"
    ];

    const cleanNode = (n: Node | null) => {
      if (!n || n.nodeType !== Node.ELEMENT_NODE) return;
      const el = n as Element;
      for (const attr of extensionAttrs) {
        if (el.hasAttribute(attr)) el.removeAttribute(attr);
      }
      if (el.querySelectorAll) {
        for (const attr of extensionAttrs) {
          const matched = el.querySelectorAll('[' + attr + ']');
          for (let i = 0; i < matched.length; i++) {
            matched[i].removeAttribute(attr);
          }
        }
      }
    };

    cleanNode(document.documentElement);

    if (typeof MutationObserver !== "undefined") {
      let observer: MutationObserver | null = null;
      const observe = () => {
        if (observer && document.documentElement) {
          observer.observe(document.documentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: extensionAttrs
          });
        }
      };

      observer = new MutationObserver((mutations) => {
        let hasMatch = false;
        for (const m of mutations) {
          if (m.attributeName && extensionAttrs.includes(m.attributeName)) {
            hasMatch = true;
            break;
          }
        }
        if (hasMatch) {
          observer?.disconnect();
          cleanNode(document.documentElement);
          observe();
        }
      });

      observe();

      return () => {
        observer?.disconnect();
      };
    }
  }, []);

  return <>{children}</>;
}
