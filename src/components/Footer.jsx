import { Link } from "react-router-dom";
import { site } from "../data/content";

export default function Footer() {
  const mapsUrl = "https://maps.app.goo.gl/WZYRXHKkiQq5tVTj7";

  return (
    <footer className="bg-[#15120f] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-2 pt-14 sm:px-6 sm:pb-3 sm:pt-16 lg:px-8 lg:pb-3 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:gap-16">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1 sm:gap-1">
              <img
                src="/images/logo.png"
                alt="Sri Vinayagaa Wood Work"
                className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
              />

              <span className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {site.name}
              </span>
            </Link>

            <p className="mt-6 max-w-sm font-serif text-xl italic leading-snug text-white sm:text-2xl">
              Crafted in wood. Designed for living.
            </p>

            <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-white/40 sm:text-[15px]">
              Thoughtfully crafted interiors and woodwork, designed around the
              way you live.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-copper">
              Quick Links
            </p>

            <div className="mt-4 flex flex-col items-start gap-3">
              <Link
                to="/"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/living-room"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Living Room
              </Link>

              <Link
                to="/kitchen"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Kitchen
              </Link>

              <Link
                to="/bedroom"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Bedroom
              </Link>

              <Link
                to="/pooja-room"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Pooja Room
              </Link>

              <Link
                to="/vanity-mirror"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Vanity &amp; Mirror
              </Link>

              <Link
                to="/workspace"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Workspace
              </Link>

              <a
                href="/#about"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                About Us
              </a>

              <a
                href="/#contact"
                className="group font-sans text-sm text-white/55 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-copper">
              Contact
            </p>

            <div className="mt-4 space-y-4">
              {/* CALL */}
              <a
                href={`tel:${site.phone}`}
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-[#2563EB]"
                  aria-hidden="true"
                >
                  <path
                    d="M6.6 2.5 9.2 2c.7-.1 1.3.3 1.5.9l1.2 3.4c.2.5 0 1.1-.4 1.4L9.8 9.2c1.1 2.2 2.9 4 5 5.1l1.5-1.7c.4-.4.9-.6 1.4-.4l3.4 1.2c.6.2 1 .8.9 1.5l-.5 2.6c-.1.7-.7 1.2-1.4 1.2C10.7 18.7 5.3 13.3 5.3 5.9c0-.7.5-1.3 1.3-1.4Z"
                    fill="currentColor"
                  />
                </svg>

                <span className="font-sans text-sm text-white">Call</span>
              </a>

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-[#25D366]"
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

                <span className="font-sans text-sm text-white">WhatsApp</span>
              </a>

              {/* MAIL */}
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-red-500"
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

                <span className="font-sans text-sm text-white">Mail</span>
              </a>

              {/* VISIT US */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-copper"
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

                <span className="font-sans text-sm text-white">Visit Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 border-t border-white/10 pt-2 lg:mt-8 lg:pt-3">
          <p className="text-center font-sans text-[10px] text-white/30 lg:text-left">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
