import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-tools > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function mobileNavClick(e) {
  e.preventDefault();
  const body = document.querySelector('body');
  if (body.classList.contains('is-open-menu')) {
    body.classList.remove('is-open-menu');
  } else {
    body.classList.add('is-open-menu');
  }
}

function mobileNav(header) {
  const mobNav = document.createElement('div');
  mobNav.className = 'nav-mob';

  const mobLogo = document.createElement('a');
  mobLogo.id = 'mob-nav-logo';
  mobLogo.className = 'icon icon-nav-logo';
  mobLogo.setAttribute('aria-label', 'Home');
  mobLogo.href = '/';
  mobNav.append(mobLogo);

  const manuLifeLogo = document.createElement('a');
  manuLifeLogo.id = 'nav-logo-manulife';
  manuLifeLogo.className = 'icon';
  manuLifeLogo.setAttribute('aria-label', 'Manulife');
  manuLifeLogo.href = '/';
  mobNav.append(manuLifeLogo);

  const toolContainer = document.createElement('div');
  toolContainer.className = 'nav-mob-tools';

  const signIn = header.querySelector('.nav-tools > ul > li:last-child > a');
  const signInLink = document.createElement('a');
  signInLink.href = signIn.href;
  signInLink.className = 'icon nav-mob-user';
  signInLink.setAttribute('aria-label', 'User Signin');
  const signInImg = document.createElement('img');
  signInImg.src = '/styles/icons/icon-user.svg';
  signInImg.width = 20;
  signInImg.height = 20;
  signInImg.alt = 'User Signin';
  signInLink.append(signInImg);
  toolContainer.append(signInLink);

  const mobMenu = document.createElement('a');
  mobMenu.className = 'icon nav-mob-menu';
  mobMenu.setAttribute('aria-label', 'Menu');
  mobMenu.href = 'about:blank';
  mobMenu.addEventListener('click', (e) => mobileNavClick(e));
  const mobMenuSpan = document.createElement('span');
  mobMenu.append(mobMenuSpan);
  toolContainer.append(mobMenu);

  mobNav.append(toolContainer);

  return mobNav;
}

function decorateNavigation(nav) {
  const navLogo = document.createElement('a');
  navLogo.id = 'nav-logo';
  navLogo.className = 'icon icon-nav-logo';
  navLogo.setAttribute('aria-label', 'Home');
  navLogo.href = '/';
  nav.prepend(navLogo);
  const mainLinks = nav.querySelectorAll('.nav-top-left > ul > li > a');
  mainLinks.forEach((a) => {
    const linkText = a.text;
    if (linkText === '') {
      a.className = 'hide';
    } else {
      const c = linkText.split(' ');
      const clsName = `icon icon-${c[0].toLowerCase()}`;

      const navIcon = document.createElement('span');
      navIcon.className = '';
      navIcon.className = clsName;
      a.prepend(navIcon);
    }
  });
}

function decorateDOM() {
  const header = document.querySelector('header');
  const nav = header.querySelector('.nav-top-left');
  const body = document.querySelector('body');

  const mobNav = mobileNav(header);
  decorateNavigation(nav);

  body.prepend(nav);
  body.append(mobNav);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['top-left', 'brand', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navSections = nav.querySelector('.nav-tools');
    if (navSections) {
      // Search handling
      const searchIcon = navSections.querySelector('.icon-search');
      console.log(searchIcon);
      const searchLink = document.createElement('a');
      searchLink.classList = 'nav-search';
      searchLink.href = 'https://www.manulife.com.ph/search-results-page.html?query=';
      const searchParent = searchIcon.parentElement;
      searchLink.append(searchIcon);
      searchParent.append(searchLink);

      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    decorateDOM();
  }
}
