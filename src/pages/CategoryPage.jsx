import { Link, useParams } from "react-router-dom";

import { motion, AnimatePresence } from "motion/react";

import { useEffect, useMemo, useState } from "react";

import { getCategory } from "../data/content";
import { recentWorksUrl } from "../data/links";
import PhotoViewer from "../components/PhotoViewer";

const categoryQuotes = {
  "living-room": "A space made for living, gathering and coming home to.",

  kitchen: "Thoughtfully crafted spaces where everyday moments come together.",

  bedroom: "A calm, considered space designed for comfort and rest.",

  "pooja-room": "A peaceful space shaped with warmth, detail and devotion.",

  "vanity-mirror": "Crafted for the everyday ritual.",

  workspace: "Crafted for the way you work.",

  "demo-b":
    "Explore crafted details designed to bring character to every space.",
};

export default function CategoryPage() {
  const { categorySlug } = useParams();

  const category = getCategory(categorySlug);

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  /*
   * True on phones and tablets (below 1024px).
   * Used to make the scroll animations faster there, without
   * touching the desktop timings.
   */
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia("(max-width: 1023px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");

    const handleChange = (event) => {
      setIsCompact(event.matches);
    };

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  /*
   * Always start category pages from the top
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const frame = requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [categorySlug]);

  /*
   * Direct photo collection
   *
   * If a category has photos directly on it and no options,
   * it is treated as a direct gallery.
   */
  const isDirectGallery =
    category?.photos?.length > 0 &&
    (!category.options || category.options.length === 0);

  const heroPhotos = useMemo(() => {
    if (!category) {
      return [];
    }

    if (category.heroPhotos?.length > 0) {
      return category.heroPhotos;
    }

    if (category.cover) {
      return [category.cover];
    }

    const firstOption = category.options?.find(
      (option) => option.cover || option.photos?.length > 0,
    );

    if (firstOption?.cover) {
      return [firstOption.cover];
    }

    if (firstOption?.photos?.length > 0) {
      return [firstOption.photos[0]];
    }

    return [];
  }, [category]);

  const safeCurrentPhoto =
    heroPhotos.length > 0 ? currentPhoto % heroPhotos.length : 0;

  const categoryQuote =
    categoryQuotes[categorySlug] ||
    "Thoughtfully crafted spaces shaped around the way you live.";

  useEffect(() => {
    if (heroPhotos.length <= 1 || isDirectGallery) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentPhoto((previous) => {
        return (previous + 1) % heroPhotos.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroPhotos, isDirectGallery]);

  /*
   * Lock the page completely while the fullscreen image viewer is open.
   * The current scroll position is preserved and restored when the viewer closes.
   */
  useEffect(() => {
    if (selectedPhoto === null) {
      return undefined;
    }

    const scrollY = window.scrollY;

    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    document.documentElement.style.overflow = "hidden";

    const preventScroll = (event) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, {
      passive: false,
    });

    window.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);

      window.scrollTo(0, scrollY);
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedPhoto === null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();

        setSelectedPhoto((current) => {
          if (current === null || !category?.photos?.length) {
            return current;
          }

          return (
            (current - 1 + category.photos.length) % category.photos.length
          );
        });
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        setSelectedPhoto((current) => {
          if (current === null || !category?.photos?.length) {
            return current;
          }

          return (current + 1) % category.photos.length;
        });
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, category?.photos?.length]);

  const showPreviousPhoto = () => {
    if (!category?.photos?.length) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === null) {
        return null;
      }

      return (current - 1 + category.photos.length) % category.photos.length;
    });
  };

  const showNextPhoto = () => {
    if (!category?.photos?.length) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === null) {
        return null;
      }

      return (current + 1) % category.photos.length;
    });
  };

  if (!category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-copper">
            404
          </p>

          <h1 className="font-serif text-5xl text-espresso">
            Collection not found
          </h1>

          <Link
            to="/"
            className="
              group
              mt-8
              inline-flex
              items-center
              font-serif
              text-2xl
              text-espresso
              sm:text-3xl
            "
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            <span className="ml-2">Back home</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="page-fade min-h-screen bg-ivory">
        {!isDirectGallery && (
          <section className="relative flex min-h-[64vh] items-end overflow-hidden bg-espresso sm:min-h-[68vh]">
            {heroPhotos.length > 0 ? (
              <AnimatePresence mode="sync">
                <motion.img
                  key={heroPhotos[safeCurrentPhoto]}
                  src={heroPhotos[safeCurrentPhoto]}
                  alt={category.name}
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 0.96,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    opacity: {
                      duration: 1.2,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 6,
                      ease: "linear",
                    },
                  }}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 bg-sand" />
            )}

            <div className="absolute inset-0 bg-[#241b16]/50" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17110d]/90 via-[#241b16]/35 to-[#241b16]/20" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-32 sm:px-8 lg:px-12">
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
                }}
                className="max-w-3xl"
              >
                <h1
                  className="
                    font-serif
                    text-5xl
                    leading-[0.9]
                    tracking-tight
                    text-white
                    sm:text-6xl
                    lg:text-8xl
                  "
                >
                  {category.name}
                </h1>

                <p
                  className="
                    mt-5
                    max-w-2xl
                    font-serif
                    text-xl
                    leading-relaxed
                    text-white/80
                    sm:text-2xl
                  "
                >
                  {categoryQuote}
                </p>
              </motion.div>
            </div>

            {heroPhotos.length > 1 && (
              <div
                className="
                  absolute
                  bottom-6
                  right-6
                  z-20
                  flex
                  items-center
                  gap-2
                  sm:right-8
                  lg:right-12
                "
              >
                {heroPhotos.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === safeCurrentPhoto
                        ? "h-[2px] w-8 bg-white transition-all duration-500"
                        : "h-[2px] w-4 bg-white/35 transition-all duration-500"
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {isDirectGallery ? (
          <>
            <section
              className="
                bg-ivory
                px-6
                pb-10
                pt-24
                sm:px-8
                sm:pb-12
                sm:pt-28
                md:pb-14
                md:pt-30
                lg:px-12
                lg:pb-16
                lg:pt-32
              "
            >
              <div className="mx-auto max-w-7xl">
                <nav
                  className="
                    mb-7
                    !text-[10.5px]
                    tracking-[0.1em]
                    text-espresso/75
                    sm:mb-8
                    lg:!text-[13px]
                    lg:tracking-[0.14em]
                  "
                >
                  <Link to="/" className="transition-colors hover:text-copper">
                    Home
                  </Link>

                  <span className="mx-2 text-espresso/40">/</span>

                  <span className="font-medium">{category.name}</span>
                </nav>

                {/* Title + quote:
                    mobile  = quote sits under the title
                    desktop = quote sits to the right of the title */}
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    lg:gap-12
                  "
                >
                  <h1
                    className="
                      font-serif
                      text-[2.5rem]
                      font-normal
                      leading-[0.92]
                      tracking-[-0.025em]
                      text-espresso
                      sm:text-6xl
                      lg:text-[5.25rem]
                    "
                  >
                    {category.name}
                  </h1>

                  <p
                    className="
                      max-w-md
                      font-serif
                      text-lg
                      italic
                      leading-7
                      text-espresso/65
                      sm:text-xl
                      sm:leading-8
                      lg:text-right
                      lg:text-2xl
                      lg:leading-9
                    "
                  >
                    {categoryQuote}
                  </p>
                </div>
              </div>
            </section>

            <section
              className="
                bg-ivory
                px-6
                pb-4
                sm:px-8
                sm:pb-6
                lg:px-12
                lg:pb-8
              "
            >
              <div className="mx-auto max-w-7xl">
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:gap-5
                    lg:grid-cols-3
                  "
                >
                  {category.photos.map((photo, index) => (
                    <motion.button
                      key={photo}
                      type="button"
                      onClick={() => setSelectedPhoto(index)}
                      initial={{
                        opacity: 0,
                        y: isCompact ? 16 : 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={
                        isCompact
                          ? {
                              once: true,
                              amount: 0.05,
                              margin: "0px 0px 150px 0px",
                            }
                          : {
                              once: true,
                              amount: 0.15,
                            }
                      }
                      transition={
                        isCompact
                          ? {
                              duration: 0.35,
                              delay: (index % 2) * 0.04,
                            }
                          : {
                              duration: 0.7,
                              delay: index * 0.06,
                            }
                      }
                      className="
                        group
                        relative
                        block
                        w-full
                        cursor-pointer
                        overflow-hidden
                        bg-sand
                        text-left
                        outline-none
                        focus:outline-none
                        focus:ring-0
                        focus:ring-offset-0
                      "
                    >
                      <img
                        src={photo}
                        alt={`${category.name} ${index + 1}`}
                        loading={index < (isCompact ? 6 : 3) ? "eager" : "lazy"}
                        decoding="async"
                        className="
                          aspect-[4/5]
                          h-full
                          w-full
                          cursor-pointer
                          object-cover
                          transition-transform
                          duration-[1200ms]
                          ease-out
                          group-hover:scale-[1.025]
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          bottom-5
                          left-5
                          opacity-0
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                      >
                        <span
                          className="
                            text-[11px]
                            font-medium
                            tracking-[0.2em]
                            text-white
                            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]
                          "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div
                  className="
                    mt-10
                    flex
                    items-center
                    justify-between
                    border-t
                    border-espresso/10
                    pt-4
                    sm:mt-12
                    sm:pt-6
                  "
                >
                  <div>
                    <Link
                      to="/#collections"
                      className="
                        group
                        inline-flex
                        cursor-pointer
                        items-center
                        font-serif
                        text-[22px]
                        text-espresso
                        sm:text-[28px]
                        lg:mt-1.5
                      "
                    >
                      <span
                        className="
                          transition-transform
                          duration-300
                          group-hover:-translate-x-1
                        "
                      >
                        ←
                      </span>

                      <span className="ml-2">All Collections</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                    {/* RECENT WORKS (desktop only, mobile uses the burger menu) */}
                    <a
                      href={recentWorksUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        group
                        hidden
                        cursor-pointer
                        items-center
                        gap-2
                        font-serif
                        text-[22px]
                        font-medium
                        !text-copper
                        sm:text-[28px]
                        lg:inline-flex
                      "
                    >
                      <span>Recent Works</span>

                      <span
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </a>

                    <a
                      href="/#contact"
                      className="
                        group
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-2
                        font-serif
                        text-[22px]
                        text-espresso
                        sm:text-[28px]
                      "
                    >
                      <span>Enquire</span>

                      <span
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="bg-ivory pb-5 pt-6 sm:pb-5 sm:pt-8 lg:pb-6 lg:pt-8">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <nav
                className="
                  mb-6
                  !text-[10.5px]
                  tracking-[0.1em]
                  text-espresso/75
                  lg:mb-5
                  lg:!text-[13px]
                  lg:tracking-[0.14em]
                "
              >
                <Link to="/" className="transition-colors hover:text-copper">
                  Home
                </Link>

                <span className="mx-2 text-espresso/40">/</span>

                <span className="font-medium">{category.name}</span>
              </nav>

              <div className="mb-7 max-w-3xl sm:mb-9 lg:mb-8">
                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="
                    font-serif
                    text-[2.25rem]
                    font-normal
                    leading-none
                    tracking-[-0.02em]
                    text-espresso
                    lg:text-[3.5rem]
                  "
                >
                  Select a category
                </motion.h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                {category.options?.map((option, index) => {
                  const image = option.cover || option.photos?.[0] || "";

                  return (
                    <motion.div
                      key={option.slug}
                      initial={{
                        opacity: 0,
                        y: isCompact ? 8 : 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0,
                        margin: "0px 0px 400px 0px",
                      }}
                      transition={
                        isCompact
                          ? {
                              duration: 0.35,
                              delay: (index % 2) * 0.04,
                            }
                          : {
                              duration: 0.7,
                              delay: index * 0.08,
                            }
                      }
                      className="h-full"
                    >
                      <Link
                        to={`/${category.slug}/${option.slug}`}
                        className="
                          group
                          relative
                          flex
                          h-full
                          aspect-[4/5]
                          overflow-hidden
                          bg-sand
                        "
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={option.name}
                            loading={isCompact || index < 3 ? "eager" : "lazy"}
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-[1200ms]
                              ease-out
                              group-hover:scale-[1.045]
                            "
                          />
                        ) : (
                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              bg-sand
                            "
                          >
                            <div className="text-center">
                              <p
                                className="
                                  font-serif
                                  text-4xl
                                  italic
                                  text-espresso/25
                                "
                              >
                                Coming soon
                              </p>

                              <p
                                className="
                                  mt-3
                                  text-[9px]
                                  uppercase
                                  tracking-[0.25em]
                                  text-espresso/25
                                "
                              >
                                Photos will be added
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/85
                            via-black/20
                            to-black/5
                            transition-all
                            duration-500
                            group-hover:from-black/90
                          "
                        />

                        <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                          <span
                            className="
                              text-[9px]
                              font-medium
                              tracking-[0.2em]
                              text-white/65
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
                          <span
                            className="
                              border
                              border-white/25
                              bg-black/10
                              px-2
                              py-1
                              text-[8px]
                              uppercase
                              tracking-[0.18em]
                              text-white/75
                              lg:backdrop-blur-[2px]
                              sm:px-3
                              sm:py-1.5
                            "
                          >
                            {option.photos?.length
                              ? `${option.photos.length} ${
                                  option.photos.length === 1
                                    ? "Photo"
                                    : "Photos"
                                }`
                              : "Collection"}
                          </span>
                        </div>

                        <div
                          className="
                            absolute
                            inset-x-0
                            bottom-0
                            p-3
                            sm:p-7
                          "
                        >
                          <h3
                            className="
                              font-serif
                              text-2xl
                              leading-none
                              text-white
                              sm:text-4xl
                              lg:text-5xl
                            "
                          >
                            {option.name}
                          </h3>

                          <div
                            className="
                              mt-3
                              flex
                              items-center
                              gap-3
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.2em]
                              text-white
                              sm:mt-6
                            "
                          >
                            <span>View Collection</span>

                            <span
                              className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                              "
                            >
                              →
                            </span>
                          </div>
                        </div>

                        <div
                          className="
                            absolute
                            inset-4
                            border
                            border-white/0
                            transition-all
                            duration-500
                            group-hover:inset-3
                            group-hover:border-white/30
                          "
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div
                className="
                  mt-6
                  flex
                  items-end
                  justify-start
                  border-t
                  border-espresso/10
                  pt-5
                  sm:mt-8
                  lg:mt-16
                  lg:pt-7
                "
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-espresso/40">
                    Collection
                  </p>

                  <Link
                    to="/#collections"
                    className="
                      group
                      mt-3
                      inline-flex
                      items-center
                      font-serif
                      text-2xl
                      text-espresso
                      sm:text-3xl
                    "
                  >
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                      ←
                    </span>

                    <span className="ml-2">All Collections</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

            <AnimatePresence>
        {isDirectGallery &&
          selectedPhoto !== null &&
          category.photos?.[selectedPhoto] && (
            <PhotoViewer
              key="photo-viewer"
              src={category.photos[selectedPhoto]}
              alt={`${category.name} ${selectedPhoto + 1}`}
              title={category.name}
              index={selectedPhoto}
              total={category.photos.length}
              onClose={() => setSelectedPhoto(null)}
              onPrev={showPreviousPhoto}
              onNext={showNextPhoto}
            />
          )}
      </AnimatePresence>
    </>
  );
}