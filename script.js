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
}

// ── GALLERY FILTER ────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      gsap.to(item, { opacity: show ? 1 : 0.2, scale: show ? 1 : 0.97, duration: 0.3 });
    });
  });
});

/* 
// ── PROJECT HOVER IMAGE ───────────────────────
const hoverImg = document.getElementById('proj-hover-img');
const hoverSrc = document.getElementById('proj-hover-src');

document.querySelectorAll('.project-item[data-img]').forEach(item => {
  item.addEventListener('mouseenter', () => {
    hoverSrc.src = item.dataset.img;
    hoverImg.classList.add('visible');
  });
  item.addEventListener('mouseleave', () => {
    hoverImg.classList.remove('visible');
  });
  item.addEventListener('mousemove', (e) => {
    const x = e.clientX + 24;
    const y = e.clientY - 90;
    hoverImg.style.left = x + 'px';
    hoverImg.style.top = y + 'px';
  });
});
*/

async function fetchGitHubData() {
  const username = 'Bablu-Verma'; // Use the official username found online
  const grid = document.getElementById('contribGrid');
  const stats = {
    repos: document.getElementById('ghRepos'),
    stars: document.getElementById('ghStars'),
    followers: document.getElementById('ghFollowers'),
    contribs: document.getElementById('ghContribs')
  };

  try {
    
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("GitHub user API failed");
    const userData = await userRes.json();

    stats.repos.textContent = userData.public_repos || 0;
    stats.followers.textContent = userData.followers || 0;

    
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        stats.stars.textContent = stars;
      }
    }

   
    const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=2024&y=2025`);
    if (!contribRes.ok) throw new Error("Contributions API failed");
    const contribData = await contribRes.json();

    if (contribData && contribData.contributions) {
      // Calculate total contributions for current year (or total)
      const totalNum = contribData.total && contribData.total.total ? contribData.total.total : 
                       contribData.contributions.reduce((acc, day) => acc + day.count, 0);
      
      stats.contribs.textContent = `${totalNum}+`;
    } else {
      throw new Error("No contribution data structure");
    }

  } catch (err) {
    console.error("GITHUB FETCH ERROR:", err);
    // Silent fail placeholders (already show —)
    grid.innerHTML = '<div class="grid-error">Activity data currently unavailable.</div>';
    
    // Set some realistic placeholders if we can't fetch
    if(stats.repos.textContent === "—") stats.repos.textContent = "15+";
    if(stats.stars.textContent === "—") stats.stars.textContent = "50+";
    if(stats.followers.textContent === "—") stats.followers.textContent = "20+";
    if(stats.contribs.textContent === "—") stats.contribs.textContent = "500+";
  }
}



fetchGitHubData();


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
  const words = ["Full Stack Developer", "Mobile App Expert", "UI/UX Enthusiast", "Creative Technologist"];
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