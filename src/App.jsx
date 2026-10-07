import { useEffect, useRef } from "react";
import { enableSiteProtection } from "./utils/siteProtection";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import OptionPage from "./pages/OptionPage";

/* Height of the navbar after it has shrunk on scroll (px) */
const getNavbarHeight = () => (window.innerWidth >= 640 ? 73 : 65);

/*
 * Links that scroll to a section of the home page.
 *
 * offset: in px. A negative value stops the scroll that many px
 *         below the top of the screen.
 *
 * center: true = the section is centered in the visible area below the
 * navbar. If the section is taller than that area, it lines up
 * just under the navbar instead.
 */
const SCROLL_TARGETS = {
  "/#contact": { selector: "#contact", offset: 0 },
  "/#about": { selector: "#about", offset: 0, center: true },
  "/#collections": { selector: "#collections", offset: -80 },
  "#work": { selector: "#work", offset: 0, alignTop: true },
};

/* Exact scroll position for targets that use center or alignTop */
const getExactY = (target) => {
  if (!target.center && !target.alignTop) {
    return null;
  }

  const element = document.querySelector(target.selector);

  if (!element) {
    return null;
  }

  const navHeight = getNavbarHeight();
  const TALL_OFFSET = 8;
  const rect = element.getBoundingClientRect();
  const sectionTop = rect.top + window.scrollY;
  const visibleHeight = window.innerHeight - navHeight;

  let y;

  if (target.alignTop) {
    /* Section top lines up exactly under the navbar */
    y = sectionTop - navHeight;
  } else if (rect.height >= visibleHeight) {
    /* Too tall to fit: start a bit below the section top */
    y = sectionTop - navHeight + TALL_OFFSET;
  } else {
    /* Center inside the area below the navbar */
    y = sectionTop - navHeight - (visibleHeight - rect.height) / 2;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  return Math.max(0, Math.min(y, maxScroll));
};

/* Only used if Lenis is not available. Respects the section's scroll-mt. */
const getFallbackY = (target) => {
  const exactY = getExactY(target);

  if (exactY !== null) {
    return exactY;
  }

  const element = document.querySelector(target.selector);

  if (!element) {
    return null;
  }

  const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;

  return Math.max(
    0,
    element.getBoundingClientRect().top +
      window.scrollY -
      margin +
      target.offset,
  );
};

/* Scrolls with Lenis, either to an exact position or to a selector */
const lenisGo = (lenis, target, options) => {
  lenis.resize();

  const exactY = getExactY(target);

  if (exactY !== null) {
    lenis.scrollTo(exactY, options);
  } else {
    lenis.scrollTo(target.selector, {
      offset: target.offset,
      ...options,
    });
  }
};

/* Timer used to keep correcting the position after a jump from another page */
let settleTimer = null;

const stopSettling = () => {
  if (settleTimer) {
    clearInterval(settleTimer);
    settleTimer = null;
  }
};

/*
 * Scrolls exactly the way the navbar "Contact" link does, by handing the
 * selector to Lenis (which respects the section's scroll-mt).
 *
 * settle = true: after the scroll animation ends, re-apply the same scroll
 * a few times so it stays exact if the page layout shifts slightly.
 */
const scrollToTarget = (lenis, target, settle = false) => {
  stopSettling();

  const element = document.querySelector(target.selector);

  if (!element) {
    return false;
  }

  if (lenis) {
    lenisGo(lenis, target, { duration: 1 });
  } else {
    window.scrollTo({
      top: getFallbackY(target),
      behavior: "smooth",
    });
  }

  window.history.replaceState(null, "", "/");

  if (settle && lenis) {
    /* If the visitor scrolls themselves, stop correcting */
    ["wheel", "touchstart", "keydown"].forEach((name) => {
      window.addEventListener(name, stopSettling, {
        once: true,
        passive: true,
      });
    });

    let checks = 0;

    settleTimer = window.setInterval(() => {
      checks += 1;

      /* Wait until the smooth scroll animation has finished */
      if (lenis.isScrolling) {
        return;
      }

      lenisGo(lenis, target, { immediate: true });

      if (checks > 20) {
        stopSettling();
      }
    }, 150);
  }

  return true;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const lenisRef = useRef(null);

  /* Basic site protection */
  useEffect(() => {
    return enableSiteProtection();
  }, []);

  /* Smooth scrolling */
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    let animationFrame;

    const raf = (time) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* If the burger menu is open, wait a moment so it can release its page
   lock first, then scroll */
  const afterMenu = (run) => {
    if (document.querySelector("[data-mobile-menu]")) {
      window.setTimeout(() => {
        lenisRef.current?.resize();
        run();
      }, 80);
    } else {
      run();
    }
  };

  /* Handle home + contact + about + all collections + work navigation */
  useEffect(() => {
    const handleSectionClick = (event) => {
      const link = event.target.closest(
        'a[href="/#contact"], a[href="/#about"], a[href="/#collections"], a[href="#work"], a[href="/"]',
      );

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");

      /* Home button / logo */
      if (href === "/") {
        /* On other pages, let the router open the home page normally */
        if (location.pathname !== "/") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        stopSettling();

        afterMenu(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, {
              duration: 1,
            });
          } else {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        });

        window.history.replaceState(null, "", "/");

        return;
      }

      const target = SCROLL_TARGETS[href];

      /*
       * Lenis (anchors: true) also listens for clicks on links like
       * "/#about" and runs its own scroll, which would override ours.
       * Stop the click here so only our scroll runs.
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (location.pathname === "/") {
        afterMenu(() => scrollToTarget(lenisRef.current, target));
        return;
      }

      sessionStorage.setItem("scrollTarget", href);

      navigate("/");
    };

    document.addEventListener("click", handleSectionClick, true);

    return () => {
      document.removeEventListener("click", handleSectionClick, true);
    };
  }, [location.pathname, navigate]);

  /* Handle page changes */
  useEffect(() => {
    const target = SCROLL_TARGETS[sessionStorage.getItem("scrollTarget")];

    if (target && location.pathname === "/") {
      /* Start from the top, then wait until fonts are loaded, the section
         exists and the page height has stopped changing */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, {
          immediate: true,
        });
      }

      let cancelled = false;
      let interval;
      let timer;

      const begin = () => {
        if (cancelled) {
          return;
        }

        let attempts = 0;
        let lastHeight = -1;
        let stableCount = 0;

        interval = setInterval(() => {
          attempts += 1;

          const element = document.querySelector(target.selector);
          const height = document.documentElement.scrollHeight;

          if (element && height === lastHeight) {
            stableCount += 1;
          } else {
            stableCount = 0;
          }

          lastHeight = height;

          const ready = element && stableCount >= 2;

          if (!ready && attempts < 40) {
            return;
          }

          clearInterval(interval);
          sessionStorage.removeItem("scrollTarget");

          if (!element) {
            return;
          }

          timer = setTimeout(() => {
            scrollToTarget(lenisRef.current, target, true);
          }, 100);
        }, 100);
      };

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(begin);
      } else {
        begin();
      }

      return () => {
        cancelled = true;
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    if (location.hash) {
      window.history.replaceState(null, "", location.pathname);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        immediate: true,
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen overflow-x-clip bg-ivory text-espresso">
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Individual option / photo gallery */}
        <Route path="/:categorySlug/:optionSlug" element={<OptionPage />} />

        {/* Category page */}
        <Route path="/:categorySlug" element={<CategoryPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
              <div className="text-center">
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-copper">
                  404
                </p>

                <h1 className="font-serif text-5xl text-espresso sm:text-6xl">
                  Page not found
                </h1>

                <a
                  href="/"
                  className="mt-8 inline-flex border-b border-espresso/30 pb-2 text-[10px] uppercase tracking-[0.2em] text-espresso transition-colors hover:border-copper hover:text-copper"
                >
                  Return Home
                </a>
              </div>
            </main>
          }
        />
      </Routes>
    </div>
  );
}
