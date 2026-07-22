//  Dark / Light Mode Toggle

var themeToggleBtn = document.getElementById('theme-toggle-button');
var rootHtml = document.documentElement;

function applyTheme(isDark) {
  if (isDark) {
    rootHtml.classList.add('dark');
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', 'true');
    }
  } else {
    rootHtml.classList.remove('dark');
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', 'false');
    }
  }
}

var storedTheme = localStorage.getItem('theme');

var systemPrefersDark =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

var initialDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);

applyTheme(initialDark);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', function () {
    var isCurrentlyDark = rootHtml.classList.contains('dark');
    var newDarkState = !isCurrentlyDark;
    applyTheme(newDarkState);
    localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
  });
}

// Scroll Spy (Active Nav Link)

var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

var pageSections = [];
for (var i = 0; i < navLinks.length; i++) {
  var linkHref = navLinks[i].getAttribute('href');
  var targetSection = document.querySelector(linkHref);
  if (targetSection) {
    pageSections.push({
      linkElement: navLinks[i],
      sectionElement: targetSection,
    });
  }
}

function updateActiveNavLink() {
  var scrollPosition = window.scrollY || document.documentElement.scrollTop;
  var currentActiveSection = null;

  for (var j = 0; j < pageSections.length; j++) {
    var sec = pageSections[j].sectionElement;

    var secTop = sec.offsetTop - 120;
    var secHeight = sec.offsetHeight;

    if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
      currentActiveSection = pageSections[j];
    }
  }

  if (scrollPosition < 50 && pageSections.length > 0) {
    currentActiveSection = pageSections[0];
  }
  var isAtBottom =
    window.innerHeight + scrollPosition >=
    document.documentElement.scrollHeight - 50;
  if (isAtBottom && pageSections.length > 0) {
    currentActiveSection = pageSections[pageSections.length - 1];
  }

  if (currentActiveSection) {
    for (var k = 0; k < pageSections.length; k++) {
      if (pageSections[k] === currentActiveSection) {
        pageSections[k].linkElement.classList.add('active');
      } else {
        pageSections[k].linkElement.classList.remove('active');
      }
    }
  }
}
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Portfolio(Nav & Tabs)

var filterButtons = document.querySelectorAll('.portfolio-filter');
var portfolioItems = document.querySelectorAll('.portfolio-item');

function filterProjects(filterValue) {
  for (var m = 0; m < portfolioItems.length; m++) {
    var item = portfolioItems[m];
    var category = item.getAttribute('data-category');

    if (filterValue === 'all' || category === filterValue) {
      item.classList.remove('hidden');
      (function (el) {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.95)';
        setTimeout(function () {
          el.style.transition = 'all 0.3s ease-in-out';
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, 50);
      })(item);
    } else {
      item.classList.add('hidden');
    }
  }
}
for (var n = 0; n < filterButtons.length; n++) {
  filterButtons[n].addEventListener('click', function (e) {
    var clickedButton = e.currentTarget;
    var filterValue = clickedButton.getAttribute('data-filter');

    for (var p = 0; p < filterButtons.length; p++) {
      var btn = filterButtons[p];
      if (btn === clickedButton) {
        btn.classList.add('active');

        btn.classList.add(
          'bg-linear-to-r',
          'from-primary',
          'to-secondary',
          'text-white',
        );
        btn.classList.remove(
          'bg-white',
          'dark:bg-slate-800',
          'text-slate-600',
          'dark:text-slate-300',
          'border',
          'border-slate-300',
          'dark:border-slate-700',
        );
      } else {
        btn.classList.remove('active');
        btn.classList.remove(
          'bg-linear-to-r',
          'from-primary',
          'to-secondary',
          'text-white',
        );
        btn.classList.add(
          'bg-white',
          'dark:bg-slate-800',
          'text-slate-600',
          'dark:text-slate-300',
          'border',
          'border-slate-300',
          'dark:border-slate-700',
        );
      }
    }
    filterProjects(filterValue);
  });
}

// Testimonials Carousel

var carousel = document.getElementById('testimonials-carousel');
var cards = document.querySelectorAll('.testimonial-card');
var indicators = document.querySelectorAll('.carousel-indicator');
var prevBtn = document.getElementById('prev-testimonial');
var nextBtn = document.getElementById('next-testimonial');

var currentIndex = 0;
var totalCards = cards.length;

var autoplayInterval = null;

var autoplayDelay = 5000;

function getVisibleCardsCount() {
  var width = window.innerWidth;
  if (width >= 1024) return 3; // Desktop shows 3 cards
  if (width >= 640) return 2; // Tablet shows 2 cards
  return 1; // Mobile shows 1 card full width
}

function getMaxIndex() {
  var maxIndex = totalCards - getVisibleCardsCount();
  if (maxIndex < 0) {
    maxIndex = 0;
  }
  return maxIndex;
}

function updateCarousel() {
  if (!carousel || cards.length === 0) return;

  var maxIndex = getMaxIndex();
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  var cardWidth = cards[0].offsetWidth;
  var translateVal = cardWidth * currentIndex;
  carousel.style.transform = 'translateX(' + translateVal + 'px)';

  for (var r = 0; r < indicators.length; r++) {
    var indIndex = parseInt(indicators[r].getAttribute('data-index'), 10);
    if (indIndex === currentIndex) {
      indicators[r].classList.add('bg-accent');
      indicators[r].classList.remove('dark:bg-slate-600', 'bg-slate-400');
      indicators[r].setAttribute('aria-selected', 'true');
    } else {
      indicators[r].classList.remove('bg-accent');
      indicators[r].classList.add('bg-slate-400');
      indicators[r].setAttribute('aria-selected', 'false');
    }
  }
}

function goToNextSlide() {
  var maxIndex = getMaxIndex();
  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

function goToPrevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = getMaxIndex();
  }
  updateCarousel();
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(function () {
    goToNextSlide();
  }, autoplayDelay);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

if (nextBtn) {
  nextBtn.addEventListener('click', function () {
    goToNextSlide();
    startAutoplay();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', function () {
    goToPrevSlide();
    startAutoplay();
  });
}

for (var s = 0; s < indicators.length; s++) {
  indicators[s].addEventListener('click', function (e) {
    var indIndex = parseInt(e.currentTarget.getAttribute('data-index'), 10);
    currentIndex = indIndex;
    updateCarousel();
    startAutoplay();
  });
}

if (carousel) {
  carousel.addEventListener('mouseenter', function () {
    stopAutoplay();
  });
  carousel.addEventListener('mouseleave', function () {
    startAutoplay();
  });
}

window.addEventListener('resize', updateCarousel);

updateCarousel();
startAutoplay();

// Scroll to Top Button

var scrollToTopBtn = document.getElementById('scroll-to-top');

function handleScrollToTopVisibility() {
  if (!scrollToTopBtn) return;

  var scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (scrollPosition > 400) {
    scrollToTopBtn.classList.remove('opacity-0', 'invisible');
    scrollToTopBtn.classList.add('opacity-100', 'visible');
  } else {
    scrollToTopBtn.classList.add('opacity-0', 'invisible');
    scrollToTopBtn.classList.remove('opacity-100', 'visible');
  }
}

window.addEventListener('scroll', handleScrollToTopVisibility);

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Sidebar Settings

var settingsSidebar = document.getElementById('settings-sidebar');
var settingsToggleBtn = document.getElementById('settings-toggle');
var closeSettingsBtn = document.getElementById('close-settings');
var colorsGrid = document.getElementById('theme-colors-grid');
var resetSettingsBtn = document.getElementById('reset-settings');

function applyThemeColor(primary, secondary, accent) {
  var rootStyle = document.documentElement.style;
  rootStyle.setProperty('--color-primary', primary);
  rootStyle.setProperty('--color-secondary', secondary);
  rootStyle.setProperty('--color-accent', accent);
}
// open side bar
function openSettings() {
  if (!settingsSidebar) return;
  settingsSidebar.classList.remove('translate-x-full');
  settingsSidebar.classList.add('translate-x-0');
  settingsSidebar.setAttribute('aria-hidden', 'false');
  if (settingsToggleBtn) {
    settingsToggleBtn.setAttribute('aria-expanded', 'true');
  }
}
// close side bar
function closeSettings() {
  if (!settingsSidebar) return;
  settingsSidebar.classList.remove('translate-x-0');
  settingsSidebar.classList.add('translate-x-full');
  settingsSidebar.setAttribute('aria-hidden', 'true');
  if (settingsToggleBtn) {
    settingsToggleBtn.setAttribute('aria-expanded', 'false');
  }
}

if (settingsToggleBtn) {
  settingsToggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (
      settingsSidebar &&
      settingsSidebar.classList.contains('translate-x-full')
    ) {
      openSettings();
    } else {
      closeSettings();
    }
  });
}

if (closeSettingsBtn) {
  closeSettingsBtn.addEventListener('click', function () {
    closeSettings();
  });
}

document.addEventListener('click', function (e) {
  if (
    settingsSidebar &&
    !settingsSidebar.classList.contains('translate-x-full')
  ) {
    if (
      !settingsSidebar.contains(e.target) &&
      settingsToggleBtn &&
      !settingsToggleBtn.contains(e.target)
    ) {
      closeSettings();
    }
  }
});

if (settingsSidebar) {
  settingsSidebar.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}

var colorThemes = [
  { id: 'indigo', primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
  {
    id: 'emerald',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#f59e0b',
  },
  { id: 'rose', primary: '#f43f5e', secondary: '#d946ef', accent: '#06b6d4' },
  { id: 'amber', primary: '#f59e0b', secondary: '#ea580c', accent: '#3b82f6' },
  { id: 'cyan', primary: '#06b6d4', secondary: '#3b82f6', accent: '#10b981' },
  { id: 'purple', primary: '#a855f7', secondary: '#ec4899', accent: '#e11d48' },
  {
    id: 'crimson',
    primary: '#dc2626',
    secondary: '#b91c1c',
    accent: '#ea580c',
  },
  {
    id: 'sapphire',
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#10b981',
  },
];

// render themes
function renderColorThemes() {
  if (!colorsGrid) return;
  colorsGrid.innerHTML = '';

  var activeThemeId = localStorage.getItem('theme-color-id') || 'indigo';

  for (var t = 0; t < colorThemes.length; t++) {
    var theme = colorThemes[t];

    var btn = document.createElement('button');
    btn.setAttribute('data-theme-id', theme.id);
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'ثيم ' + theme.id);

    btn.style.width = '40px';
    btn.style.height = '40px';
    btn.style.borderRadius = '50%';
    btn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.cursor = 'pointer';
    btn.style.position = 'relative';
    btn.style.padding = '0';
    btn.style.outline = 'none';
    btn.style.background =
      'linear-gradient(135deg, ' +
      theme.primary +
      ' 50%, ' +
      theme.secondary +
      ' 50%)';

    if (theme.id === activeThemeId) {
      btn.classList.add('active');
      btn.style.boxShadow = '0 0 0 2px var(--color-primary)';

      var checkIcon = document.createElement('i');
      checkIcon.className = 'fa-solid fa-check';
      checkIcon.style.color = '#ffffff';
      checkIcon.style.fontSize = '12px';
      checkIcon.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
      btn.appendChild(checkIcon);
    } else {
      btn.classList.remove('active');
      btn.style.boxShadow = 'none';
    }

    (function (colorBtn) {
      colorBtn.addEventListener('mouseenter', function () {
        colorBtn.style.transform = 'scale(1.1)';
      });
      colorBtn.addEventListener('mouseleave', function () {
        colorBtn.style.transform = 'scale(1)';
      });
      colorBtn.addEventListener('mousedown', function () {
        colorBtn.style.transform = 'scale(0.95)';
      });
      colorBtn.addEventListener('mouseup', function () {
        colorBtn.style.transform = 'scale(1.1)';
      });
    })(btn);

    btn.addEventListener(
      'click',
      (function (currentTheme) {
        return function () {
          // Save the chosen colors to local storage
          localStorage.setItem('theme-color-id', currentTheme.id);
          localStorage.setItem('theme-color-primary', currentTheme.primary);
          localStorage.setItem('theme-color-secondary', currentTheme.secondary);
          localStorage.setItem('theme-color-accent', currentTheme.accent);

          applyThemeColor(
            currentTheme.primary,
            currentTheme.secondary,
            currentTheme.accent,
          );

          renderColorThemes();
        };
      })(theme),
    );

    colorsGrid.appendChild(btn);
  }
}

function applyFont(fontName) {
  document.body.classList.remove(
    'font-alexandria',
    'font-tajawal',
    'font-cairo',
  );
  document.body.classList.add('font-' + fontName);

  var fontOptions = document.querySelectorAll('.font-option');
  for (var f = 0; f < fontOptions.length; f++) {
    var option = fontOptions[f];
    var optionFont = option.getAttribute('data-font');
    if (optionFont === fontName) {
      option.classList.add('active');
      option.setAttribute('aria-checked', 'true');
    } else {
      option.classList.remove('active');
      option.setAttribute('aria-checked', 'false');
    }
  }
}

var savedPrimary = localStorage.getItem('theme-color-primary');
var savedSecondary = localStorage.getItem('theme-color-secondary');
var savedAccent = localStorage.getItem('theme-color-accent');

if (savedPrimary && savedSecondary && savedAccent) {
  applyThemeColor(savedPrimary, savedSecondary, savedAccent);
} else {
  applyThemeColor('#6366f1', '#8b5cf6', '#ec4899');
}

var savedFont = localStorage.getItem('selected-font') || 'tajawal';
applyFont(savedFont);

renderColorThemes();

var fontOptionsList = document.querySelectorAll('.font-option');
for (var fo = 0; fo < fontOptionsList.length; fo++) {
  fontOptionsList[fo].addEventListener('click', function (e) {
    var selectedFontName = e.currentTarget.getAttribute('data-font');
    localStorage.setItem('selected-font', selectedFontName);
    applyFont(selectedFontName);
  });
}

if (resetSettingsBtn) {
  resetSettingsBtn.addEventListener('click', function () {
    localStorage.removeItem('selected-font');
    localStorage.removeItem('theme-color-id');
    localStorage.removeItem('theme-color-primary');
    localStorage.removeItem('theme-color-secondary');
    localStorage.removeItem('theme-color-accent');

    applyFont('tajawal');
    applyThemeColor('#6366f1', '#8b5cf6', '#ec4899');
    renderColorThemes();
  });
}

