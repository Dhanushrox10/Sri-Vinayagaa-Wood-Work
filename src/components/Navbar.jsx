import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { categories, site } from "../data/content";
import { recentWorksUrl } from "../data/links";

/*
 * One shared style for every desktop menu item
 * (Home, categories, About, Contact) so they all match.
 */
const navItemClass = `
  inline-flex
  h-10
  items-center
  justify-center
  whitespace-nowrap
  font-sans
  text-[11px]
  font-medium
  uppercase
  tracking-[0.08em]
  transition-colors
  duration-300
`;

const Chevron = ({ open }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    className={`shrink-0 transition-transform duration-300 ${
      open ? "rotate-180" : ""
    }`}
  >
    <path d="M1 3l4 4 4-4" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCat, setMobileCat] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const burgerPushed = useRef(false);

  const { pathname } = useLocation();

  /* Burger menu helpers */
  const itemBase =
    "flex items-center justify-between border-b border-espresso/10 py-3.5 font-sans text-[22px] font-medium tracking-[-0.035em]";
  const isHome = pathname === "/";
  const homeActive = isHome && activeSection === "home";
  const aboutActive = isHome && activeSection === "about";
  const contactActive = isHome && activeSection === "contact";
  const inCategory = (slug) =>
    pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Which home-page section is in the middle of the screen
     (paused while the burger menu is open, and only needed on the home page) */
  useEffect(() => {
    if (mobileOpen || pathname !== "/") {
      return undefined;
    }

    let frame = 0;

    const compute = () => {
      frame = 0;

      const mid = window.innerHeight / 2;
      const about = document.getElementById("about");
      const contact = document.getElementById("contact");

      let next = "home";

      if (contact && contact.getBoundingClientRect().top <= mid) {
        next = "contact";
      } else if (about && about.getBoundingClientRect().top <= mid) {
        next = "about";
      }

      setActiveSection(next);
    };

    const updateSection = () => {
      if (!frame) {
        frame = requestAnimationFrame(compute);
      }
    };

    compute();

    window.addEventListener("scroll", updateSection, { passive: true });
    window.addEventListener("resize", updateSection);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateSection);
      window.removeEventListener("resize", updateSection);
    };
  }, [pathname, mobileOpen]);

  /* Close the burger menu when About / Contact / Home is tapped.
     App.jsx stops these clicks before React sees them, so listen earlier.
     Also sets the active section right away. */
  useEffect(() => {
    const closeMenu = (event) => {
      const link = event.target.closest(
        '[data-mobile-menu] a[href="/#about"], [data-mobile-menu] a[href="/#contact"], [data-mobile-menu] a[href="/"]',
      );

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");

      setActiveSection(
        href === "/#about"
          ? "about"
          : href === "/#contact"
            ? "contact"
            : "home",
      );

      setMobileOpen(false);
      setMobileCat(null);
    };

    document.addEventListener("click", closeMenu, true);

    return () => {
      document.removeEventListener("click", closeMenu, true);
    };
  }, []);

  /* Freeze the page exactly where it is while the burger menu is open,
     so the page behind it can't scroll or shift */
  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      html.style.overflow = previous.htmlOverflow;

      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  /* Back button closes the burger menu instead of leaving the site */
  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    window.history.pushState({ ...window.history.state, burger: true }, "");
    burgerPushed.current = true;

    const startPath = window.location.pathname;

    const handlePop = () => {
      burgerPushed.current = false;
      setMobileOpen(false);
      setMobileCat(null);
    };

    window.addEventListener("popstate", handlePop);

    return () => {
      window.removeEventListener("popstate", handlePop);

      if (burgerPushed.current) {
        burgerPushed.current = false;

        /* Wait a moment: if a link was tapped, the page changes first,
         and we must not go back over it */
        window.setTimeout(() => {
          if (
            window.location.pathname === startPath &&
            window.history.state?.burger
          ) {
            window.history.back();
          }
        }, 120);
      }
    };
  }, [mobileOpen]);

  /* The bar looks solid when scrolled OR when the burger menu is open */
  const solid = scrolled || mobileOpen;

  const navText = scrolled ? "text-espresso" : "!text-white";

  const logoText = solid ? "text-[#8B2E2E]" : "text-white";

  const isNonCollection = () => false;

  /*
   * Only closes the menus. The smooth scroll to the top (when already on
   * the home page) is handled in App.jsx, the same way as Contact and About.
   */
  const goToHome = () => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileCat(null);
  };

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        transition-all
        duration-500

        ${
          solid
            ? `
              border-espresso/10
              bg-ivory
              shadow-sm
            `
            : `
              border-white/10
              bg-[#15120f]
              shadow-lg
              shadow-black/20
            `
        }
      `}
    >
      <nav
        className={`
          mx-auto
          flex
          max-w-[1450px]
          items-center
          justify-between
          px-5
          sm:px-6
          lg:px-8
          transition-all
          duration-500

          ${solid ? "py-3" : "py-4 sm:py-5"}
        `}
      >
        <Link
          to="/"
          onClick={goToHome}
          className="
            relative
            z-[60]
            flex
            min-w-0
            items-center
            gap-1
            sm:gap-1
          "
        >
          <img
            src="/images/logo.png"
            alt="Sri Vinayagaa Wood Work"
            className="
              h-10
              w-10
              shrink-0
              object-contain
              sm:h-12
              sm:w-12
            "
          />

          <span
            className={`
              whitespace-nowrap
              font-serif
              text-[20px]
              font-semibold
              leading-none
              tracking-tight
              transition-colors
              duration-300
              sm:text-[25px]
              lg:text-[27px]
              ${logoText}
            `}
          >
            {site.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-3 lg:flex xl:gap-4">
          <li className="flex items-center">
            <Link
              to="/"
              onClick={goToHome}
              className={`
                ${navItemClass}
                ${navText}
                hover:!text-[#A85A52]
              `}
            >
              Home
            </Link>
          </li>

          {categories.map((category) => {
            const nonCollection = isNonCollection(category);

            const isDirectGallery =
              category.slug === "vanity-mirror" ||
              category.slug === "workspace";

            const hasOptions =
              !isDirectGallery &&
              !nonCollection &&
              category.options?.length > 0;

            return (
              <li
                key={category.slug}
                className="relative flex items-center"
                onMouseEnter={() => {
                  if (hasOptions) {
                    setOpenMenu(category.slug);
                  } else {
                    setOpenMenu(null);
                  }
                }}
                onMouseLeave={() => {
                  setOpenMenu(null);
                }}
              >
                {nonCollection ? (
                  <span
                    className={`
                      ${navItemClass}
                      ${navText}
                      hover:!text-[#A85A52]
                    `}
                  >
                    {category.name}
                  </span>
                ) : (
                  <Link
                    to={`/${category.slug}`}
                    className={`
                      group
                      gap-1
                      ${navItemClass}
                      ${navText}
                      hover:!text-[#A85A52]
                    `}
                  >
                    {category.name}

                    {hasOptions && (
                      <Chevron open={openMenu === category.slug} />
                    )}
                  </Link>
                )}

                {!nonCollection && (
                  <AnimatePresence>
                    {openMenu === category.slug && hasOptions && (
                      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 8,
                            scale: 0.98,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: 6,
                            scale: 0.98,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="
                            w-max
                            min-w-[190px]
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#b86f4b]/20
                            bg-[#f7efe4]
                            p-2
                            shadow-2xl
                            shadow-black/15
                          "
                        >
                          {category.options.map((option) => (
                            <Link
                              key={option.slug}
                              to={`/${category.slug}/${option.slug}`}
                              className="
                                group
                                flex
                                items-center
                                justify-start
                                rounded-lg
                                px-4
                                py-3.5
                                transition-colors
                                duration-200
                                hover:bg-[#f0e3d4]
                              "
                            >
                              <span
                                className="
                                  font-sans
                                  text-[13px]
                                  font-medium
                                  leading-tight
                                  tracking-[-0.01em]
                                  text-[#3B3028]
                                  transition-colors
                                  duration-200
                                  group-hover:text-[#A85A52]
                                "
                              >
                                {option.name ===
                                "Kitchen Storage & Cabinets" ? (
                                  <>
                                    Kitchen Storage
                                    <br />& Cabinet
                                  </>
                                ) : (
                                  option.name
                                )}
                              </span>

                              <span
                                className="
                                  ml-auto
                                  pl-5
                                  text-sm
                                  text-[#A85A52]/40
                                  opacity-0
                                  transition-all
                                  duration-200
                                  group-hover:translate-x-1
                                  group-hover:opacity-100
                                "
                              >
                                →
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}

          <li className="flex items-center">
            <a
              href="/#about"
              className={`
                ${navItemClass}
                ${navText}
                hover:!text-[#A85A52]
              `}
            >
              About
            </a>
          </li>

          <li className="flex items-center">
            <a
              href="/#contact"
              className={`
                ${navItemClass}
                ${navText}
                hover:!text-[#A85A52]
              `}
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => {
            if (!mobileOpen) {
              /* Opening: read the current section first, then expand the current category */
              const mid = window.innerHeight / 2;
              const about = document.getElementById("about");
              const contact = document.getElementById("contact");

              if (contact && contact.getBoundingClientRect().top <= mid) {
                setActiveSection("contact");
              } else if (about && about.getBoundingClientRect().top <= mid) {
                setActiveSection("about");
              } else {
                setActiveSection("home");
              }

              setMobileCat(pathname.split("/")[1] || null);
            }
            setMobileOpen((current) => !current);
            setOpenMenu(null);
          }}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className={`
            relative
            z-[60]
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            transition-colors
            lg:hidden

            ${mobileOpen || scrolled ? "text-espresso" : "text-white"}
          `}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            {mobileOpen ? (
              <>
                <path d="M5 5l14 14" />
                <path d="M19 5L5 19" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-mobile-menu
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              fixed
              inset-x-0
              bottom-0
              top-[65px]
              sm:top-[73px]
              z-50
              overflow-y-auto
              overscroll-contain
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              bg-ivory
              px-6
              pb-10
              pt-4
              lg:hidden
            "
          >
            <div className="mx-auto max-w-xl">
              <ul>
                <li>
                  <Link
                    to="/"
                    onClick={goToHome}
                    className={`${itemBase} ${
                      homeActive ? "!text-copper" : "!text-espresso"
                    }`}
                  >
                    Home
                  </Link>
                </li>

                {categories.map((category) => {
                  const isDirectGallery =
                    category.slug === "vanity-mirror" ||
                    category.slug === "workspace";

                  const hasOptions =
                    !isDirectGallery && category.options?.length > 0;

                  const isOpen = mobileCat === category.slug;
                  const active = inCategory(category.slug);
                  const color = active ? "!text-copper" : "!text-espresso";

                  return (
                    <li key={category.slug}>
                      {hasOptions ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileCat(isOpen ? null : category.slug)
                            }
                            className={`${itemBase} w-full text-left ${color}`}
                          >
                            <span className="max-w-[260px]">
                              {category.name}
                            </span>

                            <span
                              className={`transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            >
                              <Chevron open={false} />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: {
                                    height: {
                                      duration: 0.4,
                                      ease: [0.22, 1, 0.36, 1],
                                    },
                                    opacity: { duration: 0.25, delay: 0.05 },
                                  },
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: {
                                    height: {
                                      duration: 0.3,
                                      ease: [0.22, 1, 0.36, 1],
                                    },
                                    opacity: { duration: 0.15 },
                                  },
                                }}
                                className="overflow-hidden will-change-[height]"
                              >
                                <div className="border-l border-copper/40 py-2 pl-5">
                                  {category.options.map((option) => {
                                    const optActive =
                                      pathname ===
                                      `/${category.slug}/${option.slug}`;

                                    return (
                                      <Link
                                        key={option.slug}
                                        to={`/${category.slug}/${option.slug}`}
                                        onClick={() => {
                                          setMobileOpen(false);
                                          setMobileCat(null);
                                        }}
                                        className={`group flex items-center justify-between py-2.5 pr-2 font-sans text-[16px] font-medium tracking-[-0.015em] ${
                                          optActive
                                            ? "!text-copper"
                                            : "!text-espresso"
                                        }`}
                                      >
                                        <span className="transition-colors duration-200 group-hover:text-copper">
                                          {option.name}
                                        </span>

                                        <span className="text-sm font-normal opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-copper group-hover:opacity-100">
                                          →
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={`/${category.slug}`}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileCat(null);
                          }}
                          className={`${itemBase} ${color}`}
                        >
                          <span className="max-w-[260px]">{category.name}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}

                <li>
                  <a
                    href="/#about"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileCat(null);
                    }}
                    className={`${itemBase} ${
                      aboutActive ? "!text-copper" : "!text-espresso"
                    }`}
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    href="/#contact"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileCat(null);
                    }}
                    className={`${itemBase} ${
                      contactActive ? "!text-copper" : "!text-espresso"
                    }`}
                  >
                    Contact
                  </a>
                </li>

                <li>
                  <a
                    href={recentWorksUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileCat(null);
                    }}
                    className={`${itemBase} !text-espresso`}
                  >
                    Recent Works
                  </a>
                </li>
              </ul>

              <p className="mt-10 text-center font-sans text-[8px] font-semibold uppercase tracking-[0.25em] text-espresso/30">
                {site.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
