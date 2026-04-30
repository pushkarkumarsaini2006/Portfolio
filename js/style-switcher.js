/* ========================== toggle style switcher =========================== */
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})
// hide style - switcher on scroll
window.addEventListener("scroll", () => {
    if (document.querySelector(".style-switcher").classList.contains("open")) {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})
/* ========================== theme colors =========================== */
const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(color) {
    alternateStyles.forEach((style) => {
        if (color === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        }
        else {
            style.setAttribute("disabled", "true");
        }
    })
}
/* ========================== theme light and dark mode =========================== */
const dayNight = document.querySelector(".day-night");
dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-moon");
    dayNight.querySelector("i").classList.toggle("fa-sun");
    document.body.classList.toggle("light");
})
window.addEventListener("load", () => {
    if (document.body.classList.contains("light")) {
        dayNight.querySelector("i").classList.add("fa-moon");
    }
    else {
        dayNight.querySelector("i").classList.add("fa-sun");
    }
})

/* ========================== input mode (mouse / hand gesture) =========================== */

const inputModeToggler = document.querySelector("#input-mode-toggler");

function installMediaPipeConsoleFilter() {
    if (window.__mediaPipeConsoleFilterInstalled) return;
    window.__mediaPipeConsoleFilterInstalled = true;

    const blockedPatterns = [
        /gl_context_webgl\.cc/i,
        /gl_context\.cc/i,
        /Successfully created a WebGL context/i,
        /GL version:/i,
        /OpenGL error checking is disabled/i,
    ];

    const shouldSuppress = (args) => {
        const message = args.map((arg) => String(arg)).join(" ");
        return blockedPatterns.some((pattern) => pattern.test(message));
    };

    const originalLog = console.log.bind(console);
    const originalInfo = console.info ? console.info.bind(console) : null;
    const originalWarn = console.warn ? console.warn.bind(console) : null;

    console.log = (...args) => {
        if (shouldSuppress(args)) return;
        originalLog(...args);
    };

    if (originalInfo) {
        console.info = (...args) => {
            if (shouldSuppress(args)) return;
            originalInfo(...args);
        };
    }

    if (originalWarn) {
        console.warn = (...args) => {
            if (shouldSuppress(args)) return;
            originalWarn(...args);
        };
    }
}

installMediaPipeConsoleFilter();

if (inputModeToggler) {
    inputModeToggler.addEventListener("click", async () => {
        const currentMode = window.inputControlState && window.inputControlState.mode;

        if (currentMode === "hand") {
            stopHandGestureMode();
            setInputMode("mouse");
            return;
        }

        try {
            await startHandGestureMode();
            setInputMode("hand");
        } catch (error) {
            stopHandGestureMode();
            setInputMode("mouse");
        }
    });
}

// Hand gesture tuning for faster, more sensitive control.
const HAND_MOVE_GAIN_X = 1.55;
const HAND_MOVE_GAIN_Y = 1.4;
const HAND_MOVE_SMOOTHING = 0.52;
const HAND_MOVE_DEADZONE = 0.0015;

const handControl = {
    videoEl: null,
    canvasEl: null,
    canvasCtx: null,
    previewEl: null,
    stream: null,
    hands: null,
    running: false,
    processingFrame: false,
    frameRequestId: null,
    usingVideoFrameCallback: false,
    lastClickAt: 0,
    smoothedX: 0.5,
    smoothedY: 0.5,
    twoFingerActive: false,
    hoverElement: null,
    scriptsLoaded: false,
    virtualHoverStylesInjected: false,
};

function ensureVirtualHoverStyles() {
    if (handControl.virtualHoverStylesInjected || document.getElementById("virtual-hover-styles")) {
        handControl.virtualHoverStylesInjected = true;
        return;
    }

    const style = document.createElement("style");
    style.id = "virtual-hover-styles";
    style.textContent = `
        .btn.virtual-hover {
            transform: scale(1.05) translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .shadow-dark.virtual-hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .aside .nav li a.virtual-hover {
            padding-left: 25px;
            background: linear-gradient(90deg, rgba(var(--skin-color-rgb), 0.1), transparent);
        }
        .nav li a.virtual-hover::after {
            left: 0;
        }
        .home-img.virtual-hover::before {
            transform: translate(-50%, calc(-50% - 15px)) scale(1.08);
        }
        .home-img.virtual-hover::after {
            transform: translate(-50%, calc(-50% - 15px)) scale(1.08);
            animation: none;
        }
        .home-img.virtual-hover img {
            transform: scale(1.08) translateY(-15px) !important;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5) !important;
        }
        .service .service-item .service-item-inner.virtual-hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(-10px);
            border-color: var(--skin-color);
        }
        .service .service-item .service-item-inner.virtual-hover .icon {
            background: var(--skin-color);
        }
        .service .service-item .service-item-inner.virtual-hover .icon .fa {
            font-size: 25px;
            color: #ffffff;
        }
        .portfolio .portfolio-item-inner.virtual-hover {
            border-color: var(--skin-color);
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .portfolio .portfolio-item-inner.virtual-hover .portfolio-img img {
            transform: scale(1.15) translateY(-10px);
        }
        .portfolio-item-inner.virtual-hover .project-name {
            text-shadow: 0 0 5px rgba(var(--skin-color-rgb), 0.4);
        }
        .contact .contact-info-item.virtual-hover {
            transform: translateY(-10px);
        }
        .contact .contact-info-item.virtual-hover .icon {
            transform: scale(1.2);
        }
        .contact .contact-info-item.virtual-hover .icon .fa {
            text-shadow: 0 0 8px rgba(var(--skin-color-rgb), 0.5);
        }
        .social-links a.virtual-hover {
            color: #fff;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        .social-links a.virtual-hover::before {
            transform: scale(1);
        }
    `;

    document.head.appendChild(style);
    handControl.virtualHoverStylesInjected = true;
}

function createVirtualMouseEvent(type, clientX, clientY, relatedTarget = null) {
    return new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX,
        clientY,
        relatedTarget,
    });
}

function getVirtualHoverElement(fromElement) {
    if (!fromElement) return null;
    return fromElement.closest(
        "a, button, .btn, .service-item-inner, .portfolio-item-inner, .nav li a, .contact-info-item, .timeline-item, .style-switcher .s-icon, .style-switcher .colors span, .home-img"
    );
}

function clearVirtualHoverState() {
    if (!handControl.hoverElement) return;
    handControl.hoverElement.classList.remove("virtual-hover");
    handControl.hoverElement = null;
}

function updateVirtualHoverState(clientX, clientY, targetElement) {
    const nextHover = getVirtualHoverElement(targetElement);
    const prevHover = handControl.hoverElement;

    if (prevHover === nextHover) {
        return;
    }

    if (prevHover) {
        prevHover.classList.remove("virtual-hover");
        prevHover.dispatchEvent(createVirtualMouseEvent("mouseleave", clientX, clientY, nextHover));
        prevHover.dispatchEvent(createVirtualMouseEvent("mouseout", clientX, clientY, nextHover));
    }

    handControl.hoverElement = nextHover;

    if (nextHover) {
        nextHover.classList.add("virtual-hover");
        nextHover.dispatchEvent(createVirtualMouseEvent("mouseenter", clientX, clientY, prevHover));
        nextHover.dispatchEvent(createVirtualMouseEvent("mouseover", clientX, clientY, prevHover));
    }
}

function ensureInputControlState() {
    if (!window.inputControlState) {
        window.inputControlState = { mode: "mouse" };
    }
}

function setInputModeUI(mode) {
    if (!inputModeToggler) return;

    const icon = inputModeToggler.querySelector("i");
    inputModeToggler.classList.toggle("active", mode === "hand");

    if (mode === "hand") {
        inputModeToggler.title = "Switch to mouse control";
        if (icon) {
            icon.classList.remove("fa-hand-paper");
            icon.classList.add("fa-mouse-pointer");
        }
    } else {
        inputModeToggler.title = "Switch to hand gesture control";
        if (icon) {
            icon.classList.remove("fa-mouse-pointer");
            icon.classList.add("fa-hand-paper");
        }
    }
}

function setInputMode(mode) {
    ensureInputControlState();
    window.inputControlState.mode = mode;
    setInputModeUI(mode);
    window.dispatchEvent(new CustomEvent("input-mode-change", { detail: { mode } }));
}

function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-src="${src}"]`);
        if (existing) {
            if (existing.dataset.loaded === "true") {
                resolve();
            } else {
                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
            }
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.src = src;
        script.addEventListener("load", () => {
            script.dataset.loaded = "true";
            resolve();
        }, { once: true });
        script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
        document.head.appendChild(script);
    });
}

async function ensureHandLibrariesLoaded() {
    if (handControl.scriptsLoaded && window.Hands && window.drawConnectors && window.drawLandmarks) {
        return;
    }

    await loadScriptOnce("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
    await loadScriptOnce("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");

    if (!window.Hands || !window.drawConnectors || !window.drawLandmarks) {
        throw new Error("Hand tracking libraries are unavailable.");
    }

    handControl.scriptsLoaded = true;
}

function getHiddenVideoElement() {
    if (handControl.videoEl && handControl.previewEl && handControl.canvasEl && handControl.canvasCtx) {
        return handControl.videoEl;
    }

    const preview = document.createElement("div");
    preview.className = "hand-gesture-preview";
    preview.innerHTML = '<div class="hand-gesture-preview-title">Hand Camera</div>';

    const stage = document.createElement("div");
    stage.className = "hand-gesture-preview-stage";

    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");

    stage.appendChild(video);
    stage.appendChild(canvas);
    preview.appendChild(stage);
    document.body.appendChild(preview);

    const ctx = canvas.getContext("2d");

    handControl.previewEl = preview;
    handControl.videoEl = video;
    handControl.canvasEl = canvas;
    handControl.canvasCtx = ctx;
    return video;
}

function setHandPreviewActive(isActive) {
    if (!handControl.previewEl) return;
    handControl.previewEl.classList.toggle("active", isActive);
}

function resizePreviewCanvas() {
    if (!handControl.videoEl || !handControl.canvasEl) return;

    const width = handControl.videoEl.videoWidth || 640;
    const height = handControl.videoEl.videoHeight || 480;
    handControl.canvasEl.width = width;
    handControl.canvasEl.height = height;
}

function drawPreviewOverlay(results) {
    if (!handControl.canvasCtx || !handControl.canvasEl || !handControl.videoEl) return;

    const ctx = handControl.canvasCtx;
    const canvas = handControl.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) return;

    window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
        color: "#00ffb3",
        lineWidth: 2,
    });
    window.drawLandmarks(ctx, landmarks, {
        color: "#ffffff",
        fillColor: "#00ffb3",
        radius: 3,
    });
}

function dispatchVirtualMouseMove(normalizedX, normalizedY) {
    const clientX = Math.round(normalizedX * window.innerWidth);
    const clientY = Math.round(normalizedY * window.innerHeight);
    const target = document.elementFromPoint(clientX, clientY) || document.body;

    updateVirtualHoverState(clientX, clientY, target);
    target.dispatchEvent(createVirtualMouseEvent("mousemove", clientX, clientY));
}

function dispatchVirtualClick(normalizedX, normalizedY) {
    const clientX = Math.round(normalizedX * window.innerWidth);
    const clientY = Math.round(normalizedY * window.innerHeight);
    const baseTarget = document.elementFromPoint(clientX, clientY);
    if (!baseTarget) return;

    const clickTarget = baseTarget.closest(
        "a, button, .btn, .style-switcher .s-icon, .style-switcher .colors span, [onclick], input, textarea, label"
    ) || baseTarget;

    updateVirtualHoverState(clientX, clientY, clickTarget);

    clickTarget.dispatchEvent(createVirtualMouseEvent("mousedown", clientX, clientY));
    clickTarget.dispatchEvent(createVirtualMouseEvent("mouseup", clientX, clientY));
    clickTarget.dispatchEvent(createVirtualMouseEvent("click", clientX, clientY));
}

function isFingerUp(landmarks, tipIndex, pipIndex) {
    return landmarks[tipIndex].y < landmarks[pipIndex].y - 0.015;
}

function isFingerDown(landmarks, tipIndex, pipIndex) {
    return landmarks[tipIndex].y >= landmarks[pipIndex].y - 0.008;
}

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function updatePointerFromRaw(rawX, rawY) {
    const targetX = clamp01(0.5 + (rawX - 0.5) * HAND_MOVE_GAIN_X);
    const targetY = clamp01(0.5 + (rawY - 0.5) * HAND_MOVE_GAIN_Y);

    const dx = targetX - handControl.smoothedX;
    const dy = targetY - handControl.smoothedY;
    if (Math.abs(dx) > HAND_MOVE_DEADZONE || Math.abs(dy) > HAND_MOVE_DEADZONE) {
        handControl.smoothedX += dx * HAND_MOVE_SMOOTHING;
        handControl.smoothedY += dy * HAND_MOVE_SMOOTHING;
    }

    if (typeof window.setPortfolioPointerFromNormalized === "function") {
        window.setPortfolioPointerFromNormalized(handControl.smoothedX, handControl.smoothedY);
    }
    dispatchVirtualMouseMove(handControl.smoothedX, handControl.smoothedY);
}

function handleHandResults(results) {
    if (!handControl.running || window.inputControlState?.mode !== "hand") {
        return;
    }

    drawPreviewOverlay(results);

    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) {
        handControl.twoFingerActive = false;
        return;
    }

    const indexUp = isFingerUp(landmarks, 8, 6);
    const middleUp = isFingerUp(landmarks, 12, 10);
    const ringUp = isFingerUp(landmarks, 16, 14);
    const pinkyUp = isFingerUp(landmarks, 20, 18);

    // Exact gestures:
    // 1 finger (index only) => movement
    // 2 fingers (index + middle) => click
    const isMoveGesture = indexUp && !middleUp && !ringUp && !pinkyUp;
    const isTwoFingerClickGesture = indexUp && middleUp && !ringUp && !pinkyUp;

    if (isMoveGesture) {
        const indexTip = landmarks[8];
        updatePointerFromRaw(1 - indexTip.x, indexTip.y);
    }

    if (isTwoFingerClickGesture) {
        // Keep pointer aligned while doing two-finger gesture for accurate click target.
        const indexTip = landmarks[8];
        updatePointerFromRaw(1 - indexTip.x, indexTip.y);
    }

    const now = Date.now();
    if (isTwoFingerClickGesture && !handControl.twoFingerActive && now - handControl.lastClickAt > 520) {
        handControl.twoFingerActive = true;
        handControl.lastClickAt = now;
        dispatchVirtualClick(handControl.smoothedX, handControl.smoothedY);
    } else if (!isTwoFingerClickGesture) {
        handControl.twoFingerActive = false;
    }
}

function scheduleNextHandFrame() {
    if (!handControl.running || !handControl.videoEl) return;

    if (typeof handControl.videoEl.requestVideoFrameCallback === "function") {
        handControl.usingVideoFrameCallback = true;
        handControl.frameRequestId = handControl.videoEl.requestVideoFrameCallback(() => {
            processHandFrame();
        });
    } else {
        handControl.usingVideoFrameCallback = false;
        handControl.frameRequestId = requestAnimationFrame(() => {
            processHandFrame();
        });
    }
}

async function processHandFrame() {
    if (!handControl.running || !handControl.videoEl || !handControl.hands) return;

    if (handControl.processingFrame || handControl.videoEl.readyState < 2) {
        scheduleNextHandFrame();
        return;
    }

    handControl.processingFrame = true;
    try {
        await handControl.hands.send({ image: handControl.videoEl });
    } finally {
        handControl.processingFrame = false;
        scheduleNextHandFrame();
    }
}

function stopHandGestureMode() {
    handControl.running = false;
    handControl.processingFrame = false;
    handControl.twoFingerActive = false;

    if (handControl.videoEl) {
        if (typeof handControl.videoEl.cancelVideoFrameCallback === "function" && handControl.frameRequestId !== null) {
            handControl.videoEl.cancelVideoFrameCallback(handControl.frameRequestId);
        } else if (handControl.frameRequestId !== null) {
            cancelAnimationFrame(handControl.frameRequestId);
        }
        handControl.videoEl.srcObject = null;
    }

    if (handControl.stream) {
        handControl.stream.getTracks().forEach((track) => track.stop());
        handControl.stream = null;
    }

    handControl.frameRequestId = null;
    handControl.hands = null;
    clearVirtualHoverState();
    setHandPreviewActive(false);
}

async function startHandGestureMode() {
    if (handControl.running) {
        return;
    }

    await ensureHandLibrariesLoaded();
    ensureVirtualHoverStyles();

    const video = getHiddenVideoElement();
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "user",
            width: { ideal: 960 },
            height: { ideal: 540 },
        },
        audio: false,
    });

    handControl.stream = stream;
    video.srcObject = stream;
    await video.play();

    handControl.hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handControl.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
    });

    handControl.hands.onResults(handleHandResults);

    handControl.running = true;
    handControl.processingFrame = false;
    handControl.twoFingerActive = false;
    handControl.lastClickAt = 0;
    handControl.smoothedX = 0.5;
    handControl.smoothedY = 0.5;

    setHandPreviewActive(true);
    resizePreviewCanvas();

    const onLoadedMetadata = () => {
        resizePreviewCanvas();
        scheduleNextHandFrame();
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });

    if (video.readyState >= 2) {
        onLoadedMetadata();
    }

    return;
}

// Default to mouse mode until the user enables camera mode
setInputMode("mouse");