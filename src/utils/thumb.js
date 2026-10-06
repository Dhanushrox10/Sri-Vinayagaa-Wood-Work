/* Maps an original photo path to its small copy made by scripts/make-thumbs.mjs */
export const thumb = (src) =>
  src ? src.replace("/images/", "/images-thumb/") : src;