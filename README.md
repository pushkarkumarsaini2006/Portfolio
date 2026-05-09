# Pushkar Kumar Saini Portfolio

Live site: [portfolio-sigma-eosin-73.vercel.app](https://portfolio-sigma-eosin-73.vercel.app/)

This repository contains a single-page personal portfolio built with HTML, CSS, and JavaScript. It is designed as a polished showcase site with animated sections, theme switching, interactive cards, and contact form support.

## Overview

The project is structured as a static portfolio application. The main experience lives in [index.html](index.html), shared styles are organized in [css/](css), and behavior lives in [js/](js).

The current site includes these visible sections:

- Home
- About
- Services
- Portfolio
- Contact

## Key Features

- Responsive single-page layout with anchored section navigation.
- Animated hero text powered by Typed.js.
- Particle background for visual depth.
- Custom cursor and follower effect.
- Scroll-to-top action button.
- Theme color switcher with multiple skins.
- Light and dark appearance toggle.
- Portfolio project grid with preview images.
- Contact form powered by EmailJS.
- Minified JavaScript build output for production deployment.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Typed.js
- Vanilla Tilt
- Particles.js
- Font Awesome 6
- EmailJS
- Vercel for hosting

## Project Structure

The most important files in the repository are:

- [index.html](index.html) - Main site markup and script loading.
- [css/style.css](css/style.css) - Core site styling and interaction states.
- [css/style-switcher.css](css/style-switcher.css) - Theme switcher panel styles.
- [css/skins/](css/skins) - Color theme skins.
- [js/script.js](js/script.js) - Main page behavior, animations, and section control.
- [js/style-switcher.js](js/style-switcher.js) - Theme switching and dark mode.
- [package.json](package.json) - Node scripts used to minify JavaScript.
- [vercel.json](vercel.json) - Vercel deployment config.

## Site Behavior

The portfolio includes several interactive behaviors that are already wired in the current codebase:

- Navigation between page sections through the left-side menu.
- A scroll-aware style switcher panel on the right side.
- Theme color selection through the color swatches.
- Dark/light mode toggling.
- Particle background initialization.
- Typed introduction text in the hero area.
- EmailJS submission flow for the contact form.
- Custom cursor motion and click feedback.

## Setup

### 1. Clone or open the project

Open the workspace folder directly, or clone the repository if you are starting from scratch.

### 2. Run the site locally

Use localhost instead of opening [index.html](index.html) with `file://` to avoid browser security warnings.

```bash
npm run dev
```

Then open:

- http://localhost:5500

### 3. Install JavaScript dependencies

Install Node dependencies if you want to rebuild the minified scripts:

```bash
npm install
```

### 4. Rebuild production scripts

```bash
npm run build
```

This runs the minification step defined in [package.json](package.json) and regenerates the production JavaScript bundles.

## Contact Form

The contact section is wired to EmailJS. The form is configured in the main HTML file and sends messages through the EmailJS service and template already used by the project.

If you change the EmailJS configuration, update the initialization and send details in [index.html](index.html).

## Deployment

This project is ready for static hosting. The current deployment target is Vercel, configured through [vercel.json](vercel.json).

Typical deployment flow:

1. Rebuild the minified JavaScript if you changed the source scripts.
2. Commit or upload the static files.
3. Deploy the repository to Vercel or another static host.

## Current Status

The repository is in a cleaned-up state with a single README at the root. Duplicate setup/structure documents were removed to avoid fragmentation and keep the project documentation in one place.

## Troubleshooting

If something does not work as expected:

- If the page looks stale, confirm that the browser is loading the latest HTML, CSS, and JS files.
- If theme controls do not respond, check that the style switcher panel is open.
- If the contact form does not send, verify the EmailJS configuration.

## Local Scripts

- `npm run build` - Minify the JavaScript sources into their production files.

## Contact

- Email: pushkarkumars2006@gmail.com
- LinkedIn: https://www.linkedin.com/in/pushkar-kumar-saini153600
- GitHub: https://github.com/pushkarkumarsaini2006
