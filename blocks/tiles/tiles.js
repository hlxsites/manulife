import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function metaClass(tileMeta) {
  let tMetaClass = '';
  if (tileMeta) {
    tileMeta.replaceAll('!', '').split(':').forEach((txt, i) => {
      if (i === 1) tMetaClass = `tile-bg-${txt}`;
    });
  }

  return tMetaClass;
}

export default function decorate(block) {
  /* change to ul, li */
  const mainDiv = document.createElement('div');
  mainDiv.className = 'tiles-main';
  const classes = ['tile-image', 'tile-body', 'tile-link', 'tile-meta'];
  [...block.children].forEach((row) => {
    const tileMainDiv = document.createElement('div');
    const childDiv = document.createElement('div');
    childDiv.innerHTML = row.innerHTML;
    let hasImg = false;
    [...childDiv.children].forEach((div, i) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        hasImg = true;
      }
      div.className = classes[i];
    });
    childDiv.className = 'tile-container';

    tileMainDiv.classList.add('tile');
    if (hasImg) {
      tileMainDiv.classList.add('tile-img');
    }

    const tileMeta = childDiv.querySelector('.tile-meta');
    tileMainDiv.classList.add(metaClass(tileMeta.textContent));
    tileMeta.remove();

    const tileBodyContainer = document.createElement('div');
    const tileBody = childDiv.querySelector('.tile-body');
    tileBodyContainer.innerHTML = tileBody.innerHTML;
    tileBodyContainer.className = 'tile-body-wrapper';
    tileBody.textContent = '';
    tileBody.append(tileBodyContainer);

    if (!tileBodyContainer.querySelector('p')) {
      const pTag = document.createElement('p');
      pTag.innerHTML = tileBodyContainer.innerHTML;
      tileBodyContainer.innerHTML = '';
      tileBodyContainer.append(pTag);
    }

    tileMainDiv.append(childDiv);
    mainDiv.append(tileMainDiv);
  });
  mainDiv.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(mainDiv);
}
