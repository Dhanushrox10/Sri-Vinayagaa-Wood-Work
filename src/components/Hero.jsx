import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "../data/content";

const slideDuration = 5500;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const [inView, setInView] = useState(true);

  const sectionRef = useRef(null);
  const requestedRef = useRef({});

  const photos = useMemo(
    () => [
      {
        src: "/images/tv/tv_7.webp",
        category: "Living Room",
        option: "TV Unit",
      },
      {
        src: "/images/wall-floating/wall_floating_1.webp",
        category: "Living Room",
        option: "Floating Shelves",
      },
      {
        src: "/images/wardrobe/wardrobe_6.webp",
        category: "Bedroom",
        option: "Wardrobe",
      },
      {
        src: "/images/workspace/workspace_4.webp",
        option: "Workspace",
      },
      {
        src: "/images/wardrobe/wardrobe_15.webp",
        category: "Bedroom",
        option: "Wardrobe",
      },
      {
        src: "/images/kitchen/kitchen_8.webp",
        category: "Kitchen",
        option: "Modular Kitchen",
      },
      {
        src: "/images/pooja-room/pooja_3.webp",
        category: "Pooja Room",
        option: "Pooja Unit",
      },
      {
        src: "/images/false-ceiling/false_ceiling_1.webp",
        category: "Living Room",
        option: "False Ceiling",
      },
    ],
    [],
  );

  const slides = useMemo(
    () =>
      photos.length > 0
        ? photos
        : [
            {
              src: "/images/hero.webp",
              category: "Interior",
              option: "Woodwork",
            },
          ],
    [photos],
  );

  /* -----------------------------------------
     PRELOAD IMAGES
     Only the current slide and the next two,
     instead of all of them at once.
  ----------------------------------------- */

  useEffect(() => {
    [0, 1, 2].forEach((step) => {
      const slide = slides[(current + step) % slides.length];

      if (!slide || requestedRef.current[slide.src]) {
        return;
      }

      requestedRef.current[slide.src] = true;

      const image = new Image();

      image.src = slide.src;

      image.onload = () => {
        setLoadedImages((previous) => ({
          ...previous,
          [slide.src]: true,
        }));
      };

      image.onerror = () => {
        setFailedImages((previous) => ({
          ...previous,
          [slide.src]: true,
        }));
      };
    });
  }, [current, slides]);

  /* -----------------------------------------
     PAUSE WHEN THE HERO IS OFF SCREEN
  ----------------------------------------- */

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* -----------------------------------------
     AUTOMATIC SLIDESHOW
  ----------------------------------------- */

  useEffect(() => {
    if (slides.length <= 1 || !inView) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, slideDuration);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length, inView]);

  const activeSlide = slides[current] || slides[0];

  /* -----------------------------------------
     WHATSAPP
  ----------------------------------------- */

  const quoteLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hi ${site.name}, I'd like to know more about your work.`,
  )}`;

  return (
    /*
     * Height: lvh is a fixed height (it does not change while you scroll),
     * so the page no longer jumps when the phone's address bar hides.
     * --hero-extra is the difference between the big and small screen
     * heights (0 on desktop). It keeps the bottom items (counter, label,
     * progress bar) sitting at the bottom of the visible screen.
     */
    <section
      ref={sectionRef}
      style={{ "--hero-extra": "calc(100lvh - 100svh)" }}
      className="relative flex min-h-lvh items-start overflow-hidden bg-espresso text-white lg:items-center"
    >
      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="absolute inset-0 bg-espresso" />

      <AnimatePresence mode="sync">
        <motion.div
          key={activeSlide.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          {!failedImages[activeSlide.src] && (
            <motion.img
              src={activeSlide.src}
              alt=""
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: slideDuration / 1000,
                ease: "linear",
              }}
              className={`
                h-full w-full object-cover
                transition-opacity duration-700
                ${loadedImages[activeSlide.src] ? "opacity-100" : "opacity-0"}
              `}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* =====================================
          IMAGE OVERLAYS
      ===================================== */}

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/15" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pt-32">
        <div className="max-w-4xl">
          {/* Heading */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-4xl
              font-serif
              text-[clamp(3.1rem,13.8vw,3.9rem)]
              leading-[1.02]
              tracking-tight
              sm:text-[4.75rem]
              md:text-[6rem]
              lg:text-[6.5rem]
            "
          >
            Spaces designed
            <span className="block italic text-copper">to feel like home.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.65,
            }}
            className="
              mt-8
              max-w-xl
              text-sm
              leading-7
              text-white/70
              sm:text-base
            "
          >
            Custom interiors and woodwork crafted for the way you live — from
            elegant living spaces and TV units to modular kitchens, wardrobes
            and more.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.85,
            }}
            className="
              mt-9
              flex flex-col items-start gap-3
              sm:flex-row
            "
          >
            <a
              href="#work"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-4
                rounded-full
                bg-copper
                px-7 py-3.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-white
                transition-all
                duration-300
                hover:bg-white
                hover:!text-[#8B2E2E]
              "
            >
              View Our Work
              <svg
                className="h-3 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 6h17M13 1.5 18 6l-5 4.5" />
              </svg>
            </a>

            <a
              href={quoteLink}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-white/40
                bg-white/5
                px-7 py-3.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-white
                hover:!text-[#8B2E2E]
                lg:backdrop-blur-sm
              "
            >
              Enquire Now
            </a>
          </motion.div>
        </div>
      </div>

      {/* =====================================
          FEATURED WORK LABEL
      ===================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSlide.category}-${activeSlide.option}`}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
            absolute
            bottom-[calc(1.75rem_+_var(--hero-extra))]
            right-6
            z-10
            text-right
            sm:right-8
            lg:bottom-14
            lg:right-12
          "
        >
          <p className="text-[7px] uppercase tracking-[0.3em] text-white/50 lg:text-[9px]">
            Featured Work
          </p>

          <p className="mt-0.5 font-serif text-sm text-white lg:mt-1 lg:text-xl">
            {activeSlide.option}
          </p>

          <p className="mt-0.5 text-[7px] uppercase tracking-[0.2em] text-copper lg:text-[9px]">
            {activeSlide.category}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* =====================================
          SLIDE COUNTER
      ===================================== */}

      <div className="absolute bottom-[calc(2rem_+_var(--hero-extra))] left-6 z-10 flex items-center gap-4 sm:left-8 lg:left-12">
        <span className="font-serif text-2xl text-white">
          {String(current + 1).padStart(2, "0")}
        </span>

        <span className="h-px w-10 bg-white/30" />

        <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* =====================================
          PROGRESS BAR
      ===================================== */}

      <div className="absolute bottom-[var(--hero-extra)] left-0 right-0 z-10 h-px bg-white/10">
        <motion.div
          key={`${current}-${inView}`}
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: 1,
          }}
          transition={{
            duration: slideDuration / 1000,
            ease: "linear",
          }}
          className="h-full w-full origin-left bg-copper"
        />
      </div>

      {/* =====================================
          SCROLL INDICATOR
      ===================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.8,
          duration: 1,
        }}
        className="
          absolute
          bottom-[calc(2rem_+_var(--hero-extra))]
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          md:block
        "
      >
        <a href="#work" className="group flex flex-col items-center gap-3">
          <span className="text-[8px] uppercase tracking-[0.35em] text-white/50 transition-colors group-hover:text-white">
            Scroll
          </span>

          <span className="relative h-10 w-px overflow-hidden bg-white/20">
            <motion.span
              animate={{
                y: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-x-0 h-1/2 bg-copper"
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}