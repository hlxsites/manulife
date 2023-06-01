import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

function constructMobileFooter(footer) {
  footer.querySelectorAll('.footer-links > div > div > p').forEach((footHeading, index) => {
    const parent = footHeading.parentElement;
    const id = `footer-links-${index}`;

    const label = document.createElement('label');
    label.classList.add('icon');
    label.classList.add('icon-arrow');
    label.htmlFor = id;
    label.appendChild(footHeading);
    parent.prepend(label);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    parent.prepend(checkbox);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const classes = ['primary', 'social', 'disc'];
    classes.forEach((c, i) => {
      const section = footer.children[0].children[i];
      if (section) section.classList.add(`foot-${c}`);
      if (i === 1) {
        const socail = ['facebook', 'instagram', 'twitter', 'youtube'];
        socail.forEach((a, b) => {
          const slink = section.children[0].children[1].children[b];
          if (slink) {
            slink.classList.add('icon');
            slink.classList.add(`icon-${a}`);
            slink.setAttribute('aria-label', slink.innerHTML);
            const sText = document.createElement('span');
            sText.innerHTML = slink.innerHTML;
            slink.innerHTML = '';
            slink.append(sText);
          }
        });
      }
    });

    constructMobileFooter(footer);

    decorateIcons(footer);
    block.append(footer);
  }
}
