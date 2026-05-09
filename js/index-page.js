// Use requestIdleCallback for non-critical library initialization
const initLibraries = () => {
  if (typeof particlesJS !== 'undefined') {
    const skinColor = getComputedStyle(document.documentElement).getPropertyValue('--skin-color').trim() || '#fa5252';
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: skinColor },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
        size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
        line_linked: { enable: true, distance: 150, color: skinColor, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(initLibraries, { timeout: 2000 });
} else {
  setTimeout(initLibraries, 200);
}

window.addEventListener('load', function() {
  setTimeout(() => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
      loader.classList.add('fade-out');
    }
  }, 1000);
});

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverElements = document.querySelectorAll('a, button, .btn, .service-item-inner, .portfolio-item-inner, .nav li a');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

const scrollToTopBtn = document.querySelector('.scroll-to-top');
const sections = document.querySelectorAll('.section');

if (scrollToTopBtn) {
  sections.forEach(section => {
    section.addEventListener('scroll', function() {
      if (this.classList.contains('active')) {
        if (this.scrollTop > 300) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      }
    });
  });

  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      scrollToTopBtn.classList.remove('visible');
    });
  });

  const hireMeBtn = document.querySelector('.hire-me');
  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', () => {
      scrollToTopBtn.classList.remove('visible');
    });
  }

  scrollToTopBtn.addEventListener('click', () => {
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
      activeSection.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

const skillBars = document.querySelectorAll('.progress-in');
const aboutSection = document.querySelector('#about');

function animateSkillBars() {
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.setProperty('--progress-width', width);
    bar.style.width = '0%';
    setTimeout(() => {
      bar.classList.add('animate');
    }, 500);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (aboutSection) {
  observer.observe(aboutSection);
}

const navLinksAOS = document.querySelectorAll('.nav li a');
navLinksAOS.forEach(link => {
  link.addEventListener('click', () => {
    setTimeout(() => {
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 500);
  });
});

const initVanillaTilt = () => {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
    });
  }
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(initVanillaTilt, { timeout: 3000 });
} else {
  setTimeout(initVanillaTilt, 500);
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

const infoItems = document.querySelectorAll('.info-item');
infoItems.forEach((item, index) => {
  item.style.animationDelay = `${index * 0.1}s`;
});

navLinksAOS.forEach(link => {
  link.addEventListener('mouseenter', function() {
    this.style.transform = 'translateX(5px)';
  });
  link.addEventListener('mouseleave', function() {
    this.style.transform = 'translateX(0)';
  });
});

const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
  });
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
});

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    const circleDot = this.querySelector('.circle-dot');
    if (circleDot) circleDot.style.transform = 'scale(1.5)';
  });
  item.addEventListener('mouseleave', function() {
    const circleDot = this.querySelector('.circle-dot');
    if (circleDot) circleDot.style.transform = 'scale(1)';
  });
});

const magneticButtons = document.querySelectorAll('.btn');
magneticButtons.forEach(btn => {
  let rect = null;
  btn.addEventListener('mouseenter', function() {
    rect = this.getBoundingClientRect();
  });
  btn.addEventListener('mousemove', function(e) {
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  btn.addEventListener('mouseleave', function() {
    rect = null;
    this.style.transform = 'translate(0, 0)';
  });
});

const contactInfoItems = document.querySelectorAll('.contact-info-item');
contactInfoItems.forEach((item, index) => {
  item.style.opacity = '1';
  item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
});

let serviceCount = 0;
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    serviceCount++;
  });
});

const rippleButtons = document.querySelectorAll('.btn');
rippleButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
  @keyframes rippleEffect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(dynamicStyle);

document.addEventListener('DOMContentLoaded', function() {
  if (window.emailjs) {
    emailjs.init('GYQ6VHEu_6LIkKgs_');
  }
});

window.addEventListener('load', function () {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || email === '' || subject === '' || message === '') {
      alert('Please fill all fields to submit the form.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const templateParams = {
      from_name: name,
      reply_to: email,
      to_name: 'Pushkar Kumar Saini',
      subject: subject,
      message: message
    };

    emailjs.send('service_7y7igtl', 'template_hyqul7y', templateParams)
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
          submitButton.classList.add('submitted');
          submitButton.textContent = 'Sent';
        }
        contactForm.reset();
        setTimeout(() => {
          if (submitButton) {
            submitButton.classList.remove('submitted');
            submitButton.textContent = 'Send';
          }
        }, 750);
      })
      .catch(function (error) {
        console.log('FAILED...', error);
        alert('Failed to send the email. Please try again.');
      });
  });
});
