# Sri Vinayagaa Wood Work

A responsive website for **Sri Vinayagaa Wood Work**, a custom interior and woodwork business in Kottivakkam, Chennai, serving customers since 1997.

**Live site:** https://srivinayagaawoodwork.vercel.app

## Features

- Full-screen hero slideshow with featured work labels
- Collections for Living Room, Kitchen, Bedroom, Pooja Room, Vanity & Mirror and Workspace
- Category pages with option galleries (TV Unit, Wardrobe, Modular Kitchen and more)
- Full-screen photo viewer with keyboard and swipe navigation
- Smooth scrolling and scroll-triggered animations
- Burger menu for phones and tablets that highlights the current page or section
- Contact through WhatsApp, call, email and Google Maps
- Fully responsive layout for mobile, tablet and desktop

## Tech Stack

- React with Vite
- React Router
- Tailwind CSS v4
- Motion (animations)
- Lenis (smooth scrolling)
- Hosted on Vercel

## Getting Started

```bash
git clone https://github.com/Dhanushrox10/Sri-Vinayagaa-Wood-Work.git
cd Sri-Vinayagaa-Wood-Work
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
public/          Images, logo and favicon files
src/
  components/    Navbar, Hero, CategoryShowcase, Footer, PhotoViewer
  pages/         Home, CategoryPage, OptionPage
  data/          content.js (categories and photos), links.js
  App.jsx        Routes and scroll handling
  index.css      Theme colors and fonts
vercel.json      Rewrites for React Router
```

## Editing Content

- Business details and gallery photos live in `src/data/content.js`.
- The recent works link is in `src/data/links.js`.

## Contact

**Saravanan S.**, Founder & Owner

- Phone: +91 98402 74500
- Email: srivinayagaawoodwork@gmail.com
- Address: No. 5/489, Venkatesa Puram, Kottivakkam, Chennai - 600041