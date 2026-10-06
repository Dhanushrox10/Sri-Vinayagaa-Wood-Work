import { useEffect } from "react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryShowcase from "../components/CategoryShowcase";
import { site } from "../data/content";

const reasons = [
  {
    title: "Thoughtful Design",
    text: "Beautiful and practical designs created specifically for your room, your needs and the way you live.",
  },
  {
    title: "Quality Materials",
    text: "We focus on reliable materials, quality fittings and finishes chosen for strength, appearance and long-term everyday use.",
  },
  {
    title: "Expert Craftsmanship",
    text: "From accurate measurements to installation and finishing, every stage is handled with attention to detail and precision.",
  },
  {
    title: "Reliable Support",
    text: "If an issue arises with our workmanship, we take responsibility and work to resolve it at no additional cost.",
  },
];

export default function Home() {
  const mapsUrl = "https://maps.app.goo.gl/WZYRXHKkiQq5tVTj7";

  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />

      <CategoryShowcase />

      {/* ─────────────────────────────────────────
          WHY CHOOSE US
      ───────────────────────────────────────── */}

      <section
        id="why-choose-us"
        className="bg-sand px-5 pb-4 pt-10 max-lg:overflow-x-clip sm:px-6 sm:pb-6 sm:pt-12 lg:px-8 lg:pb-14 lg:pt-14"
      >
        <div className="mx-auto max-w-7xl">
          {/* Heading + Quote */}
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-serif text-5xl font-medium leading-[0.9] tracking-[-0.04em] text-espresso sm:text-6xl md:text-7xl lg:text-8xl">
                Why
                <span className="block italic text-copper">Choose Us?</span>
              </h2>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center max-lg:justify-end lg:min-h-[145px] lg:pl-10"
            >
              <p className="max-w-xl font-serif text-xl leading-relaxed text-espresso/65 max-lg:text-right sm:text-2xl lg:text-3xl">
                “Designed with care, crafted to last.”
              </p>
            </motion.div>
          </div>

          {/* Four Reasons */}
          <div className="mt-9 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:mt-11 lg:grid-cols-4 lg:gap-0">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: false,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                className="
                  group
                  flex
                  min-h-0
                  flex-col
                  rounded-2xl
                  border
                  border-espresso/10
                  bg-[#F5F0E8]
                  p-5
                  text-left
                  max-lg:mx-auto
                  max-lg:w-[87%]
                  sm:p-6
                  lg:min-h-[175px]
                  lg:rounded-none
                  lg:border-y-0
                  lg:border-l-0
                  lg:border-r
                  lg:bg-transparent
                  lg:px-7
                  lg:py-10
                  lg:first:pl-0
                  lg:last:border-r-0
                  lg:last:pr-0
                "
              >
                <h3 className="font-sans text-xl font-semibold leading-tight tracking-[-0.025em] text-espresso sm:text-[21px]">
                  {reason.title}
                </h3>

                <p className="mt-3 font-sans text-sm leading-6 text-espresso/55 text-pretty max-lg:w-full lg:mt-4 lg:max-w-xs">
                  {reason.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          ABOUT
      ───────────────────────────────────────── */}

      <section
        id="about"
        className="bg-espresso px-5 py-10 max-lg:overflow-x-clip sm:px-6 sm:py-12 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-24">
            {/* LEFT — ABOUT US */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-5xl font-medium leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                About
                <span className="block italic text-copper">Us.</span>
              </h2>

              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-copper/60" />

                <span className="font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-white/35">
                  Since 1997
                </span>
              </div>
            </motion.div>

            {/* RIGHT — STORY */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{
                once: false,
                amount: window.innerWidth >= 1024 ? 0.25 : 0.1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
            >
              <p className="max-w-3xl font-serif text-2xl leading-[1.15] text-white sm:text-3xl lg:text-5xl">
                Creating beautiful spaces with{" "}
                <span className="text-copper">
                  quality workmanship, thoughtful design and attention to
                  detail.
                </span>
              </p>

              <div className="mt-8 max-w-2xl space-y-5 font-sans text-sm leading-7 text-white/55 text-pretty sm:text-[15px]">
                <p>
                  {site.name} has been crafting interior and woodwork solutions
                  since 1997, bringing years of hands-on experience into every
                  project we undertake.
                </p>

                <p>
                  From detailed woodwork and elegant living spaces to modular
                  kitchens, wardrobes, TV units and thoughtfully designed
                  interiors, our work is shaped by a simple belief — every
                  detail matters.
                </p>

                <p>
                  We focus on doing the work right: understanding the space,
                  paying attention to measurements and proportions, choosing
                  suitable materials, and giving every finish the care it
                  deserves.
                </p>

                <p>
                  The result is work that is clean, functional and carefully
                  finished — designed to look beautiful and remain a valued part
                  of your home for years to come.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CONTACT
      ───────────────────────────────────────── */}

      <section
        id="contact"
        className="scroll-mt-[55px] bg-ivory px-5 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10 lg:px-8 lg:pb-[138px] lg:pt-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="max-w-md font-serif text-4xl leading-[1.05] text-espresso sm:text-5xl lg:text-6xl">
                Let's create something{" "}
                <span className="text-copper">beautiful.</span>
              </h2>

              <p className="mt-6 max-w-md font-sans text-sm leading-7 text-espresso/55 sm:text-[15px]">
                Have a new home or woodwork project in mind? Tell us what you
                are looking for and let's discuss your space.
              </p>

              {/* Founder (desktop only — phones/tablets show it below the cards) */}
              <div className="mt-10 hidden lg:block">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-copper sm:text-xs">
                  Founder & Owner
                </p>

                <p className="mt-3 font-serif text-3xl font-medium text-espresso sm:text-4xl">
                  Saravanan S.
                </p>

                <p className="mt-2 font-sans text-sm text-espresso/45 sm:text-[15px]">
                  Sri Vinayagaa Wood Work
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: window.innerWidth >= 1024 ? 0.25 : 0.05,
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="
                group flex min-h-[115px] flex-col justify-start rounded-2xl
                border border-espresso/10 bg-[#F5F0E8] p-6
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#EDE5D8]
                hover:border-[#25D366]/40 hover:shadow-xl
                hover:shadow-black/5 sm:min-h-[135px] sm:p-8
              "
              >
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <path
                      d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.2 1.6 6L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.3 14.2c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.4-3.9-3.2-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.8.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3Z"
                      fill="white"
                    />
                  </svg>

                  <h3 className="font-sans text-lg font-semibold text-espresso">
                    WhatsApp
                  </h3>
                </div>
              </a>

              {/* CALL */}
              <a
                href={`tel:${site.phone}`}
                className="
                group flex min-h-[115px] flex-col justify-start rounded-2xl
                border border-espresso/10 bg-[#F5F0E8] p-6
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#EDE5D8]
                hover:border-[#2563EB]/40 hover:shadow-xl
                hover:shadow-black/5 sm:min-h-[135px] sm:p-8
              "
              >
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 shrink-0 text-[#2563EB] transition-transform duration-300 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.6 2.5 9.2 2c.7-.1 1.3.3 1.5.9l1.2 3.4c.2.5 0 1.1-.4 1.4L9.8 9.2c1.1 2.2 2.9 4 5 5.1l1.5-1.7c.4-.4.9-.6.9-.6l3.4 1.2c.6.2 1 .8.9 1.5l-.5 2.6c-.1.7-.7 1.2-1.4 1.2C10.7 18.7 5.3 13.3 5.3 5.9c0-.7.5-1.3 1.3-1.4Z"
                      fill="currentColor"
                    />
                  </svg>

                  <h3 className="font-sans text-lg font-semibold text-espresso">
                    Call Us
                  </h3>
                </div>
              </a>

              {/* EMAIL */}
              <a
                href={`mailto:${site.email}`}
                className="
                group flex min-h-[115px] flex-col justify-start rounded-2xl
                border border-espresso/10 bg-[#F5F0E8] p-6
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#EDE5D8]
                hover:border-red-500/40 hover:shadow-xl
                hover:shadow-black/5 sm:min-h-[135px] sm:p-8
              "
              >
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 shrink-0 text-red-500 transition-transform duration-300 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <rect
                      x="2.5"
                      y="4.5"
                      width="19"
                      height="15"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="m3.5 6 8.5 7 8.5-7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h3 className="font-sans text-lg font-semibold text-espresso">
                    Email Us
                  </h3>
                </div>
              </a>

              {/* VISIT US */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="
                group flex min-h-[115px] flex-col justify-start rounded-2xl
                border border-espresso/10 bg-espresso p-6
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#493D34]
                hover:border-copper/50 hover:shadow-xl
                hover:shadow-black/10 sm:min-h-[135px] sm:p-8
              "
              >
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 shrink-0 text-copper transition-transform duration-300 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 10.2c0 5.1-8 11.3-8 11.3S4 15.3 4 10.2a8 8 0 1 1 16 0Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>

                  <h3 className="font-sans text-lg font-semibold text-white">
                    Visit Us
                  </h3>
                </div>

                <p className="mt-4 font-sans text-sm leading-6 text-white/50">
                  Sri Vinayagaa Wood Work
                </p>
              </a>
            </motion.div>

            {/* Founder (phones/tablets only — after the four cards) */}
            <div className="lg:hidden">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-copper">
                Founder & Owner
              </p>

              <p className="mt-3 font-serif text-3xl font-medium text-espresso">
                Saravanan S.
              </p>

              <p className="mt-2 font-sans text-sm text-espresso/45">
                Sri Vinayagaa Wood Work
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}