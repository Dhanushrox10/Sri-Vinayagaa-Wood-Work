import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;

const freshGesture = () => ({
  scale: 1,
  x: 0,
  y: 0,
  pinching: false,
  startDist: 0,
  startScale: 1,
  startX: 0,
  startY: 0,
  startTx: 0,
  startTy: 0,
  startTime: 0,
  moved: false,
  lastTap: 0,
});

const touchDistance = (a, b) =>
  Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

/*
 * Fullscreen photo viewer.
 *
 * Desktop (1024px and up): same look as before, with the arrow buttons.
 * Phones/tablets: no arrow buttons. Swipe left/right to change photo,
 * pinch or double-tap to zoom.
 */
export default function PhotoViewer({
  src,
  alt,
  title,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}) {
  const imgRef = useRef(null);
  const gesture = useRef(freshGesture());

  /* New photo = start unzoomed */
  useEffect(() => {
    gesture.current = freshGesture();
  }, [src]);

  const apply = (animated = false) => {
    const img = imgRef.current;

    if (!img) {
      return;
    }

    const { scale, x, y } = gesture.current;

    img.style.transition = animated ? "transform 0.25s ease-out" : "none";
    img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  /* Keep the zoomed photo from being dragged far out of view */
  const clampPan = () => {
    const img = imgRef.current;

    if (!img) {
      return;
    }

    const g = gesture.current;
    const maxX = (img.offsetWidth * (g.scale - 1)) / 2;
    const maxY = (img.offsetHeight * (g.scale - 1)) / 2;

    g.x = Math.max(-maxX, Math.min(maxX, g.x));
    g.y = Math.max(-maxY, Math.min(maxY, g.y));
  };

  const handleTouchStart = (event) => {
    if (event.target.closest("button")) {
      return;
    }

    const g = gesture.current;

    if (event.touches.length === 2) {
      g.pinching = true;
      g.startDist = touchDistance(event.touches[0], event.touches[1]);
      g.startScale = g.scale;
      return;
    }

    if (event.touches.length === 1 && !g.pinching) {
      const touch = event.touches[0];

      g.startX = touch.clientX;
      g.startY = touch.clientY;
      g.startTx = g.x;
      g.startTy = g.y;
      g.startTime = Date.now();
      g.moved = false;
    }
  };

  const handleTouchMove = (event) => {
    const g = gesture.current;

    if (event.touches.length === 2 && g.pinching) {
      const dist = touchDistance(event.touches[0], event.touches[1]);

      g.scale = Math.min(
        MAX_ZOOM,
        Math.max(1, (g.startScale * dist) / g.startDist),
      );

      if (g.scale === 1) {
        g.x = 0;
        g.y = 0;
      } else {
        clampPan();
      }

      apply();
      return;
    }

    if (event.touches.length === 1 && !g.pinching) {
      const touch = event.touches[0];
      const dx = touch.clientX - g.startX;
      const dy = touch.clientY - g.startY;

      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        g.moved = true;
      }

      if (g.scale > 1) {
        g.x = g.startTx + dx;
        g.y = g.startTy + dy;
        clampPan();
        apply();
      }
    }
  };

  const handleTouchEnd = (event) => {
    const g = gesture.current;

    /* Wait until every finger is lifted */
    if (event.touches.length > 0) {
      return;
    }

    if (g.pinching) {
      g.pinching = false;

      if (g.scale < 1.05) {
        g.scale = 1;
        g.x = 0;
        g.y = 0;
        apply(true);
      }

      return;
    }

    if (event.target.closest("button")) {
      return;
    }

    const touch = event.changedTouches[0];
    const dx = touch.clientX - g.startX;
    const dy = touch.clientY - g.startY;
    const elapsed = Date.now() - g.startTime;

    /* Swipe to change photo (only when not zoomed in) */
    if (
      g.scale === 1 &&
      Math.abs(dx) > 50 &&
      Math.abs(dx) > Math.abs(dy) * 1.5 &&
      elapsed < 700
    ) {
      if (dx < 0) {
        onNext();
      } else {
        onPrev();
      }

      return;
    }

    /* Double tap to zoom in / out */
    if (!g.moved && elapsed < 300) {
      const now = Date.now();

      if (now - g.lastTap < 300) {
        g.lastTap = 0;

        if (g.scale > 1) {
          g.scale = 1;
        } else {
          g.scale = DOUBLE_TAP_ZOOM;
        }

        g.x = 0;
        g.y = 0;
        apply(true);
      } else {
        g.lastTap = now;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[100]
        overscroll-none
        touch-none
        bg-[#17110d]/96
      "
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* CLOSE */}
      <button
        type="button"
        aria-label="Close gallery"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="
          absolute
          right-5
          top-5
          z-30
          flex
          h-10
          w-10
          cursor-pointer
          items-center
          justify-center
          text-3xl
          font-light
          text-white/75
          transition-colors
          hover:text-white
          sm:right-8
          sm:top-8
        "
      >
        ×
      </button>

      {/* PREVIOUS (desktop only) */}
      <button
        type="button"
        aria-label="Previous photo"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        className="
          group
          absolute
          left-4
          top-1/2
          z-30
          hidden
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          text-4xl
          font-light
          text-white/65
          transition-colors
          hover:text-white
          sm:left-8
          sm:text-5xl
          md:left-12
          lg:flex
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
      </button>

      {/* NEXT (desktop only) */}
      <button
        type="button"
        aria-label="Next photo"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        className="
          group
          absolute
          right-4
          top-1/2
          z-30
          hidden
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          text-4xl
          font-light
          text-white/65
          transition-colors
          hover:text-white
          sm:right-8
          sm:text-5xl
          md:right-12
          lg:flex
        "
      >
        <span
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </button>

      {/* IMAGE */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
          px-3
          py-16
          lg:px-32
          lg:py-20
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="pointer-events-auto"
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              className="
                max-h-[82vh]
                max-w-[94vw]
                object-contain
                will-change-transform
                lg:max-h-[80vh]
                lg:max-w-[78vw]
              "
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* IMAGE INFO */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-6
          left-6
          z-30
          sm:bottom-8
          sm:left-8
          lg:left-12
        "
      >
        <p
          className="
            font-serif
            text-2xl
            leading-none
            text-white
            sm:text-3xl
          "
        >
          {title}
        </p>

        <p
          className="
            mt-2
            text-[9px]
            uppercase
            tracking-[0.25em]
            text-white/45
          "
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </p>
      </div>
    </motion.div>
  );
}