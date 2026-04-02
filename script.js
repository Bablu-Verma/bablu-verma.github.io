// ── LOADER ──────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const counter = document.getElementById('loader-counter');
  const name = document.getElementById('loader-name');

  // Animate name in
  gsap.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: () => { loader.style.display = 'none'; initAnimations(); }
        });
      }, 300);
    }
    bar.style.width = progress + '%';
    counter.textContent = String(Math.floor(progress)).padStart(3, '0');
  }, 60);
});

// ── CUSTOM CURSOR ──────────────────────────────
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

const isMobile = () => window.innerWidth <= 768;

window.addEventListener('mousemove', (e) => {
  if (isMobile()) return;
  
  const { clientX: x, clientY: y } = e;
  
  // Direct follow for dot
  cursorDot.style.left = `${x}px`;
  cursorDot.style.top = `${y}px`;
  
  // Smooth lag for outline
  gsap.to(cursorOutline, {
    x: x,
    y: y,
    duration: 0.5,
    ease: 'power3.out'
  });
});

document.querySelectorAll('a, button, .project-item, .gallery-item, .skill-tag, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

// ── INIT GSAP ANIMATIONS ──────────────────────
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title lines
  gsap.from('.title-line', {
    yPercent: 110,
    stagger: 0.12,
    duration: 1,
    ease: 'power4.out',
  });

  // Hero right image reveal
  gsap.from('.hero-right', {
    opacity: 0,
    x: 60,
    rotateY: -20,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.5
  });

  // Reveal elements on scroll
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Init Typing
  initTyping();

  // Mouse interact for Hero Visual
  const heroVisual = document.querySelector('.hero-visual-container');
  if (heroVisual) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to(heroVisual, {
        rotateY: x,
        rotateX: -y,
        duration: 1,
        ease: 'power2.out'
      });
    });
  }

  // Stats counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.floor(this.targets()[0].val) + '+'; }
        });
      }
    });
  });

  // Gallery items stagger
  gsap.from('.gallery-item', {
    opacity: 0,
    y: 40,
    stagger: 0.08,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#galleryGrid',
      start: 'top 80%'
    }
  });

  // Navbar background
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      const nav = document.getElementById('navbar');
      nav.style.boxShadow = self.progress > 0 ? '0 4px 40px rgba(0,0,0,0.06)' : 'none';
    }
  });

  // Terminal Simulation & Interaction
  initTerminal();
}

function initTerminal() {
  const terminal = document.querySelector('.terminal-container');
  const history = document.getElementById('terminal-history');
  const realInput = document.getElementById('terminal-real-input');
  const displayInput = document.getElementById('terminal-input-display');
  
  if (!terminal || !realInput) return;

  const sections = {
    'about': '#about',
    'services': '#services',
    'projects': '#projects',
    'gallery': '#gallery',
    'experience': '#experience',
    'education': '#education',
    'testimonials': '#testimonials',
    'faq': '#faq',
    'contact': '#contact',
    'home': '#hero'
  };

  const commands = {
    'help': () => {
      let menu = '<div class="terminal-output">Available commands: <br>';
      menu += Object.keys(sections).map(s => `- <span style="color:var(--accent); cursor:pointer;" onclick="scrollToSection('${sections[s]}')">${s}</span>`).join('<br>');
      menu += '<br>- clear (Clear terminal)</div>';
      return menu;
    },
    'clear': () => {
      history.innerHTML = '';
      return '';
    },
    'whoami': () => '<div class="terminal-output">Bablu Verma — Full Stack Developer & App Expert</div>',
    'ls': () => '<div class="terminal-output">about.doc  projects.exe  gallery.zip  contact.sh</div>'
  };

  // Scroll to section helper
  window.scrollToSection = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  };

  // Handle typing inside terminal
  terminal.addEventListener('click', () => realInput.focus());

  realInput.addEventListener('input', () => {
    displayInput.textContent = realInput.value;
  });

  const performCommand = (cmdStr) => {
    const val = cmdStr.toLowerCase().trim();
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="t-prompt">$</span> ${cmdStr}`;
    history.appendChild(line);
    
    if (commands[val]) {
      const output = commands[val]();
      if (output) {
        const outLine = document.createElement('div');
        outLine.innerHTML = output;
        history.appendChild(outLine);
      }
    } else if (sections[val]) {
      scrollToSection(sections[val]);
      const outLine = document.createElement('div');
      outLine.className = 'terminal-output';
      outLine.textContent = `Redirecting to ${val}...`;
      history.appendChild(outLine);
    } else if (val !== '') {
      const err = document.createElement('div');
      err.className = 'terminal-output';
      err.style.color = '#ff5f56';
      err.textContent = `Command not found: ${val}. Type 'help' for options.`;
      history.appendChild(err);
    }

    realInput.value = '';
    displayInput.textContent = '';
    
    // Auto-scroll terminal to bottom
    setTimeout(() => {
      const body = document.getElementById('terminalGrid');
      body.scrollTop = body.scrollHeight;
    }, 10);
  };

  realInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performCommand(realInput.value);
    }
  });

  // Highlight help command initially
  setTimeout(() => {
    const hint = document.createElement('div');
    hint.className = 'terminal-output';
    hint.style.opacity = "0.4";
    hint.innerHTML = '<i>[Type "help" to explore sections]</i>';
    history.appendChild(hint);
  }, 1000);
}

// ── GALLERY FILTER ────────────────────────────
function applyFilter(filter) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    const show = filter === 'all' || item.dataset.cat === filter;
    gsap.to(item, { opacity: show ? 1 : 0.2, scale: show ? 1 : 0.97, duration: 0.3 });
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

// Initialize with 'all' filter active
applyFilter('all');




async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const successMsg = document.getElementById('form-success');
  
  // Update button state
  const originalBtnHTML = btn.innerHTML;
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  try {
    const formData = new FormData(form);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      btn.innerHTML = '<span>Sent ✓</span>';
      successMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      successMsg.style.display = 'block';
      successMsg.style.color = 'green';
      form.reset();
    } else {
      btn.innerHTML = '<span>Error!</span>';
      successMsg.textContent = '❌ Something went wrong. Please try again.';
      successMsg.style.display = 'block';
      successMsg.style.color = 'red';
    }
  } catch (error) {
    btn.innerHTML = '<span>Error!</span>';
    console.error("Form error:", error);
    successMsg.textContent = '❌ Failed to connect. Check your connection.';
    successMsg.style.display = 'block';
    successMsg.style.color = 'red';
  } finally {
    setTimeout(() => {
      btn.innerHTML = originalBtnHTML;
      btn.disabled = false;
    }, 4000);
  }
}


document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}


document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});


// ── TYPING EFFECT ─────────────────────────────
function initTyping() {
  const words = ["Full Stack Developer", "Mobile App Expert", "Backend Architect", "System Engineer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const target = document.querySelector(".typing-text");
  if (!target) return;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 40 : 80);
    }
  }
  type();
}

// ── CASE STUDY MODAL LOGIC ────────────────────
window.openCaseStudy = function(index) {
  const allDetails = document.querySelectorAll('.project-details-data');
  const targetData = allDetails[index];
  const modal = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('modalBody');
  
  if (targetData && modal && modalBody) {
    modalBody.innerHTML = targetData.innerHTML;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent Scroll
    
    // Animate content reveal
    gsap.from('#modalBody > *', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });
  }
}

window.closeCaseStudy = function() {
  const modal = document.getElementById('caseStudyModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore Scroll
  }
}

// ── FAQ ACCORDION LOGIC ───────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close other items
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('active');
    });
    
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ── TESTIMONIALS SLIDER NAVIGATION ────────────
window.slideTestimonials = (direction) => {
  const track = document.querySelector('.testimonials-track');
  if (track) {
    const scrollAmount = track.clientWidth * 0.8;
    track.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
};
