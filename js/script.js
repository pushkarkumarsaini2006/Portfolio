/* ============================== typing animation ============================ */
var typed = new Typed(".typing", {
    strings: ["Software Engineer", "Full Stack Developer",],
    typeSpeed: 100,
    BackSpeed: 40,
    loop: true,
})
var typed = new Typed(".typing1", {
    strings: ["Developer", "Engineer", "Student", "Researcher"],
    typeSpeed: 100,
    BackSpeed: 40,
    loop: true,
})
/* ============================== Aside ============================ */
const nav = document.querySelector(".nav"),
    navList = nav.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;
for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function (event) {
        event.preventDefault();
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                addBackSection(j);
                // allSection[j].classList.add("back-section");
            }
            navList[j].querySelector("a").classList.remove("active");
        }
        this.classList.add("active")
        showSection(this);
        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn();
        }
    })
}
function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section");
    }
}
function addBackSection(num) {
    allSection[num].classList.add("back-section");
}
function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active")
}
function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split("#")[1]) {
            navList[i].querySelector("a").classList.add("active");
        }
    }
}
document.querySelector(".hire-me").addEventListener("click", function (event) {
    event.preventDefault();
    const sectionIndex = this.getAttribute("data-section-index");
    //console.log(sectionIndex);
    showSection(this);
    updateNav(this);
    removeBackSection();
    addBackSection(sectionIndex);
})
const navTogglerBtn = document.querySelector(".nav-toggler"),
    aside = document.querySelector(".aside");
navTogglerBtn.addEventListener("click", () => {
    asideSectionTogglerBtn();
})
function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.toggle("open");
    }
}

// Prevent generic placeholder links from triggering file:// navigation warnings.
document.querySelectorAll('a[href="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

/* ============================== POINTER-DRIVEN MOTION ============================== */

function initPointerMotion() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mainContent = document.querySelector(".main-content");
    const heroImage = document.querySelector(".home-img img");
    if (!mainContent && !heroImage) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let motionEnabled = false;

    if (!window.inputControlState) {
        window.inputControlState = { mode: "mouse" };
    }

    function setTargetsFromNormalized(normalizedX, normalizedY) {
        if (!motionEnabled) return;
        const clampedX = Math.max(0, Math.min(1, normalizedX));
        const clampedY = Math.max(0, Math.min(1, normalizedY));
        targetX = (clampedX - 0.5) * 16;
        targetY = (clampedY - 0.5) * 16;
        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    window.setPortfolioPointerFromNormalized = setTargetsFromNormalized;

    function animate() {
        if (!motionEnabled) {
            currentX = 0;
            currentY = 0;
            targetX = 0;
            targetY = 0;
            if (mainContent) mainContent.style.transform = `translate3d(0, 0, 0)`;
            if (heroImage) heroImage.style.transform = `translate3d(0, 0, 0)`;
            rafId = null;
            return;
        }

        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;

        if (mainContent) {
            mainContent.style.transform = `translate3d(${currentX * 0.2}px, ${currentY * 0.2}px, 0)`;
        }
        // Only apply parallax transform if not hovering over home-img
        if (heroImage) {
            const homeImgContainer = heroImage.closest(".home-img");
            const isHovering = homeImgContainer && homeImgContainer.matches(":hover");
            if (!isHovering) {
                heroImage.style.transform = `translate3d(${currentX * -0.8}px, ${currentY * -0.8}px, 0)`;
            }
        }

        const nearRest = Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1;
        if (!nearRest) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
        }
    }

    document.addEventListener("mousemove", (event) => {
        if (!motionEnabled || window.inputControlState.mode !== "mouse") return;
        const normalizedX = event.clientX / window.innerWidth;
        const normalizedY = event.clientY / window.innerHeight;
        setTargetsFromNormalized(normalizedX, normalizedY);
    });

    document.addEventListener("mouseleave", () => {
        if (!motionEnabled) return;
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(animate);
    });

    window.addEventListener("input-mode-change", (event) => {
        motionEnabled = event.detail.mode === "hand";
        
        if (!motionEnabled) {
            targetX = 0;
            targetY = 0;
            currentX = 0;
            currentY = 0;
            if (mainContent) mainContent.style.transform = `translate3d(0, 0, 0)`;
            if (heroImage) heroImage.style.transform = `translate3d(0, 0, 0)`;
            // Enable hover effects when switching away from camera mode
            document.documentElement.classList.remove("camera-mode");
            document.documentElement.style.transition = "all 0.3s ease";
        } else {
            // Disable hover effects when in camera mode
            document.documentElement.classList.add("camera-mode");
            document.documentElement.style.transition = "all 0.1s ease";
        }
    });

    // Listen for clicks and provide visual feedback in camera mode
    document.addEventListener("click", (e) => {
        if (motionEnabled && document.documentElement.classList.contains("camera-mode")) {
            const clickEl = e.target;
            if (clickEl && clickEl !== document.body && clickEl !== document.documentElement) {
                clickEl.setAttribute("data-clicked", "true");
                setTimeout(() => {
                    clickEl.removeAttribute("data-clicked");
                }, 150);
            }
        }
    }, true);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPointerMotion);
} else {
    initPointerMotion();
}
