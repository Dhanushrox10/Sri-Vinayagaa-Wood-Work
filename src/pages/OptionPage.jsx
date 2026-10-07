import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { getCategory, getOption } from "../data/content";
import { recentWorksUrl } from "../data/links";
import PhotoViewer from "../components/PhotoViewer";

export default function OptionPage() {
  const { categorySlug, optionSlug } = useParams();

  const category = getCategory(categorySlug);
  const option = getOption(categorySlug, optionSlug);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  /* True on phones and tablets (below 1024px): faster scroll animations */
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

  /* Always start gallery pages from the top */
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
  }, [categorySlug, optionSlug]);

  useEffect(() => {
    if (selectedPhoto === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

  const showPreviousPhoto = () => {
    if (!option?.photos?.length) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === null) {
        return null;
      }

      return (current - 1 + option.photos.length) % option.photos.length;
    });
  };

  const showNextPhoto = () => {
    if (!option?.photos?.length) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === null) {
        return null;
      }

      return (current + 1) % option.photos.length;
    });
  };

  useEffect(() => {
    if (selectedPhoto === null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setSelectedPhoto((current) => {
          if (current === null || !option?.photos?.length) {
            return current;
          }

          return (current - 1 + option.photos.length) % option.photos.length;
        });
      }

      if (event.key === "ArrowRight") {
        setSelectedPhoto((current) => {
          if (current === null || !option?.photos?.length) {
            return current;
          }

          return (current + 1) % option.photos.length;
        });
      }

      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, option?.photos?.length]);

  if (!category || !option) {
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
              cursor-pointer
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
      <main className="page-fade flex min-h-screen flex-col bg-ivory">
        {/* OPTION HEADER */}
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
            {/* BREADCRUMB */}
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

              <Link
                to={`/${category.slug}`}
                className="transition-colors hover:text-copper"
              >
                {category.name}
              </Link>

              <span className="mx-2 text-espresso/40">/</span>

              <span className="font-medium">{option.name}</span>
            </nav>

            {/* TITLE */}
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
              {option.name}
            </h1>
          </div>
        </section>

        {/* GALLERY */}
        <section
          className="
            flex
            flex-1
            flex-col
            bg-ivory
            px-6
            pb-4
            sm:px-8
            sm:pb-6
            lg:px-12
            lg:pb-8
          "
        >
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {option.photos?.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  sm:gap-5
                  lg:grid-cols-3
                "
              >
                {option.photos.map((photo, index) => (
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
                        : { once: true, amount: 0.15 }
                    }
                    transition={
                      isCompact
                        ? { duration: 0.35, delay: (index % 2) * 0.04 }
                        : { duration: 0.5, delay: (index % 3) * 0.08 }
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
                      alt={`${option.name} ${index + 1}`}
                      loading={!isCompact || index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index < 3 ? "high" : "auto"}
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

                    {/* IMAGE NUMBER */}
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
                        {option.names?.[index] && (
                          <span className="ml-2">{option.names[index]}</span>
                        )}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-[40vh]
                  items-center
                  justify-center
                  bg-sand
                "
              >
                <div className="text-center">
                  <p
                    className="
                      font-serif
                      text-5xl
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
                      text-espresso/30
                    "
                  >
                    Photos will be added
                  </p>
                </div>
              </div>
            )}

            {/* Pushes the bottom buttons down to the bottom of the page */}
            <div className="mt-auto">
              {/* BOTTOM NAVIGATION */}
              <div
                className="
                  mt-10
                  flex
                  items-center
                  justify-between
                  border-t
                  border-espresso/10
                  pt-3
                  sm:mt-12
                  sm:pt-6
                "
              >
                <div>
                  <Link
                    to={`/${category.slug}`}
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

                    <span className="ml-2">{category.name}</span>
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
          </div>
        </section>
      </main>

      {/* GALLERY IMAGE VIEWER */}
      <AnimatePresence>
        {selectedPhoto !== null && option.photos?.[selectedPhoto] && (
          <PhotoViewer
            key="photo-viewer"
            src={option.photos[selectedPhoto]}
            alt={`${option.name} ${selectedPhoto + 1}`}
            title={option.names?.[selectedPhoto] || option.name}
            index={selectedPhoto}
            total={option.photos.length}
            onClose={() => setSelectedPhoto(null)}
            onPrev={showPreviousPhoto}
            onNext={showNextPhoto}
          />
        )}
      </AnimatePresence>
    </>
  );
}