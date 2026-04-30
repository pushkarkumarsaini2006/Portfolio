# Pushkar Kumar Saini Portfolio

Live site: [portfolio-sigma-eosin-73.vercel.app](https://portfolio-sigma-eosin-73.vercel.app/)

This repository contains a single-page personal portfolio built with HTML, CSS, JavaScript, and a small optional Python helper for webcam-based cursor control. It is designed as a polished showcase site with animated sections, theme switching, interactive cards, contact form support, and support for both mouse and hand-gesture input modes.

## Overview

The project is structured as a static portfolio application. The main experience lives in [index.html](index.html), shared styles are organized in [css/](css), and behavior lives in [js/](js). The Python script [hand_cursor_control.py](hand_cursor_control.py) is optional and only needed if you want to control the system cursor with hand gestures.

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
- Optional hand gesture control through Python, OpenCV, MediaPipe, and PyAutoGUI.
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
- Python 3 for optional hand-gesture control
- OpenCV, MediaPipe, and PyAutoGUI for local cursor automation
- Vercel for hosting

## Project Structure

The most important files in the repository are:

- [index.html](index.html) - Main site markup and script loading.
- [css/style.css](css/style.css) - Core site styling and interaction states.
- [css/style-switcher.css](css/style-switcher.css) - Theme switcher panel styles.
- [css/skins/](css/skins) - Color theme skins.
- [js/script.js](js/script.js) - Main page behavior, animations, and section control.
- [js/style-switcher.js](js/style-switcher.js) - Theme switching, dark mode, and gesture mode control.
- [js/script.min.js](js/script.min.js) - Minified production build of the main script.
- [js/style-switcher.min.js](js/style-switcher.min.js) - Minified production build of the style switcher.
- [hand_cursor_control.py](hand_cursor_control.py) - Optional webcam cursor controller.
- [requirements.txt](requirements.txt) - Python dependencies for the gesture helper.
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
- Optional mouse/hand input mode switching.

The hand-gesture mode is controlled through the style switcher toggle. The green camera status badge that previously appeared in the top-right corner has been removed, but the mode switch itself remains available.

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

This runs the minification step defined in [package.json](package.json) and regenerates:

- [js/script.min.js](js/script.min.js)
- [js/style-switcher.min.js](js/style-switcher.min.js)

### 5. Optional: enable hand gesture control

Install the Python dependencies and start the helper script:

```bash
pip install -r requirements.txt
python hand_cursor_control.py
```

## Hand Gesture Mode

The optional Python helper turns your webcam into a cursor controller. This is separate from the browser and runs at the operating-system level.

### Gestures

- One finger up: move the cursor.
- Two fingers up: click.
- Pinch gesture: legacy click support.
- Press `q` in the camera window to quit.

### Notes

- The browser does not need camera permission for this mode because the webcam access happens in Python.
- The mode is useful on desktop and laptop systems only.
- The current browser UI includes a toggle in the style switcher to switch between mouse and hand control.

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
- If the hand mode toggle does not work, make sure the Python helper is running.
- If the contact form does not send, verify the EmailJS configuration.
- If the gesture script cannot start, confirm Python, OpenCV, MediaPipe, and PyAutoGUI are installed correctly.

## Local Scripts

- `npm run build` - Minify the JavaScript sources into their production files.
- `python hand_cursor_control.py` - Start webcam-based hand cursor control.

## Contact

- Email: pushkarkumars2006@gmail.com
- LinkedIn: https://www.linkedin.com/in/pushkar-kumar-saini153600
- GitHub: https://github.com/pushkarkumarsaini2006
