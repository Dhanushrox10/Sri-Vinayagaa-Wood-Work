import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { categories } from "../data/content";
import { recentWorksUrl } from "../data/links";

export default function CategoryShowcase() {
  /* True on phones and tablets (below 1024px): lighter animations */
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

  return (
    <section
      id="work"
      className="bg-ivory py-8 max-lg:overflow-x-clip max-sm:scroll-mt-[65px] sm:max-lg:scroll-mt-[73px] sm:py-10 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: isCompact, amount: 0.2 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8"
          >
            {/* LEFT — TITLE */}
            <div className="shrink-0">
              <h2 className="font-serif text-5xl font-medium leading-[0.9] tracking-[-0.04em] text-espresso sm:text-6xl md:text-7xl lg:text-8xl">
                Explore
                <span className="block italic text-copper">Our Work.</span>
              </h2>
            </div>

            {/* RIGHT — QUOTE */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: isCompact, amount: 0.2 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="relative max-w-sm text-left md:right-[130px] md:max-w-md md:text-center lg:max-w-lg"
            >
              <p className="font-serif text-lg font-medium italic leading-8 tracking-[-0.01em] text-black sm:text-xl sm:leading-9 md:text-2xl md:leading-10">
                “A collection of spaces shaped by
                <br className="hidden sm:block" />
                thoughtful design and craftsmanship.”
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Category Cards */}
        <div
          id="collections"
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
        >
          {categories.map((category, index) => {
            const image =
              category.cover ||
              category.options?.find(
                (option) => option.cover || option.photos?.length > 0,
              )?.cover ||
              "";

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: isCompact ? 12 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={
                  isCompact
                    ? {
                        once: true,
                        amount: 0.02,
                        margin: "0px 0px 120px 0px",
                      }
                    : { once: false, amount: 0.02 }
                }
                transition={{
                  duration: 0.28,
                  delay: isCompact ? (index % 2) * 0.04 : index * 0.02,
                  ease: "easeOut",
                }}
              >
                <Link
                  to={`/${category.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden bg-sand"
                >
                  {/* Image */}
                  {image ? (
                    <img
                      src={image}
                      alt={category.name}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-sand">
                      <div className="text-center">
                        <p className="font-serif text-4xl italic text-espresso/25">
                          Coming soon
                        </p>

                        <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-espresso/25">
                          Future collection
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

                  {/* Bottom Content */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-7">
                    <h3 className="font-serif text-2xl font-medium leading-none text-white min-[480px]:text-4xl sm:text-5xl">
                      {category.name}
                    </h3>

                    {/* Explore */}
                    <div className="mt-3 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white sm:mt-6">
                      <span>Explore</span>

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Inner Rectangle */}
                  <div className="absolute inset-4 border border-white/0 transition-all duration-500 group-hover:inset-3 group-hover:border-white/30" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Works — centered row on phones/tablets, one line on desktop */}
        <div className="mt-3 flex flex-row items-center justify-center gap-3 border-t border-espresso/10 pt-5 text-left sm:mt-4 sm:gap-6 sm:pt-6 lg:mt-16 lg:gap-10 lg:pt-10 lg:text-center">
          <p className="min-w-0 font-serif text-[20px] italic leading-snug text-espresso sm:text-3xl lg:whitespace-nowrap">
            Our latest projects, <br className="lg:hidden" />
            updated regularly.
          </p>

          <a
            href={recentWorksUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-3 border border-copper/50 bg-sand/60 px-3 py-3 text-left font-serif text-lg italic leading-tight !text-copper transition-colors duration-300 hover:border-copper hover:bg-copper hover:!text-ivory sm:px-7 sm:py-3.5 sm:text-2xl lg:whitespace-nowrap lg:text-xl lg:leading-[1.75rem]"
          >
            <span>
              View Recent
              <br className="lg:hidden" /> Works
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 lg:hidden">
                →
              </span>
            </span>

            <span className="hidden transition-transform duration-300 group-hover:translate-x-1 lg:inline-block">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}