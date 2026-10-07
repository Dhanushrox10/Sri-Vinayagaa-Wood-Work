import { useEffect } from "react";

const SITE = "Sri Vinayagaa Wood Work";
const DEFAULT_TITLE = "Sri Vinayagaa Wood Work | Interior & Woodwork Designs";

/*
 * Sets the browser tab title (and the search description) for a page.
 * Call with no arguments on the home page to use the default title.
 */
export function usePageTitle(title, description) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta ? meta.getAttribute("content") : null;

    document.title = title ? `${title} | ${SITE}` : DEFAULT_TITLE;

    if (meta && description) {
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = DEFAULT_TITLE;

      if (meta && previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}