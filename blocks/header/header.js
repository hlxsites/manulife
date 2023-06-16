import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

/*  */
function topNavLink(e, t) {
  e.preventDefault();

  if (t.parentElement.classList.contains('nav-active')) {
    t.parentElement.classList.remove('nav-active');
  } else {
    t.parentElement.classList.add('nav-active');
  }
}

/* Mobile hamburger icon click */
function mobileNavClick(e) {
  e.preventDefault();
  const body = document.querySelector('body');
  if (body.classList.contains('is-open-menu')) {
    body.classList.remove('is-open-menu');
    body.classList.add('is-close-menu');
  } else {
    body.classList.add('is-open-menu');
    body.classList.remove('is-close-menu');
  }
}

/* Mobile navigation handline */
function mobileNav(header) {
  const mobNav = document.createElement('div');
  mobNav.className = 'nav-mob';

  const mobLogo = document.createElement('a');
  mobLogo.id = 'mob-nav-logo';
  mobLogo.className = 'icon icon-nav-logo';
  mobLogo.setAttribute('aria-label', 'Home');
  mobLogo.href = 'https://www.manulife.com.ph/';
  mobNav.append(mobLogo);

  const manuLifeLogo = document.createElement('a');
  manuLifeLogo.id = 'nav-logo-manulife';
  manuLifeLogo.className = 'icon';
  manuLifeLogo.setAttribute('aria-label', 'Manulife');
  manuLifeLogo.href = '#';
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
  navLogo.href = 'https://www.manulife.com.ph/';
  nav.prepend(navLogo);

  const mainListContainer = nav.querySelector('.nav-top-left > ul');
  mainListContainer.classList.add('primary-nav');

  /* Mobile nav - Search Link */
  const searchContainer = document.createElement('li');
  searchContainer.classList.add('desktop-hide');
  const searchLink = document.createElement('a');
  searchLink.classList = 'nav-search';
  searchLink.href = 'https://www.manulife.com.ph/search-results-page.html?query=';
  searchLink.innerText = 'Search';
  searchContainer.append(searchLink);
  mainListContainer.prepend(searchContainer);

  /* Desktop - 2nd Level Navigation */
  const subNavEle = nav.querySelectorAll('.nav-top-left > ul li >ul');
  subNavEle.forEach((subNav) => {
    subNav.classList.add('sub-nav');
    const anchor = document.createElement('a');
    anchor.classList.add('logo');
    anchor.setAttribute('href', '/');
    anchor.textContent = 'Manulife';
    const listItem = document.createElement('li');
    listItem.appendChild(anchor);
    subNav.insertBefore(listItem, subNav.firstChild);
  });
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

      a.parentElement.classList.add(`subnav-${c[0].toLowerCase()}`);
    }
  });

  /* Mobile nav - Top Link 2 Column */
  const businessLineContainer = document.createElement('li');
  businessLineContainer.classList.add('desktop-hide');
  businessLineContainer.classList.add('business-line');
  businessLineContainer.innerHTML = '<ul><li><a href="https://www.manulife-chinabank.com.ph/MCB-Landing-Page">Manulife China Bank</a></li><li><a href="https://assetmanagement.manulife.com.ph/Home">Manulife Investment Management</a></li></ul>';
  mainListContainer.prepend(businessLineContainer);
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
      const searchLink = document.createElement('a');
      searchLink.classList = 'nav-search';
      searchLink.href = 'https://www.manulife.com.ph/search-results-page.html?query=';
      searchLink.setAttribute('aria-label', 'Search');
      const searchParent = searchIcon.parentElement;
      searchLink.append(searchIcon);
      searchParent.append(searchLink);
    }

    // Desktop - Top link handling
    const topLink = navSections.querySelector('ul li:first-child > a');
    topLink.addEventListener('click', (e) => topNavLink(e, topLink));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    decorateDOM();
  }
}
