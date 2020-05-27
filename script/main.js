//Menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '4bc8f24c60123ebaf470e476b9cf276c';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

const DBService = class {
  /*constructor(name. age) {
    this.name = name;
    this.age = age;
  }*/
  getData = async (url) => {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      } else {
          throw new Error(`Files can not be found here ${url}`)
      }
  }

  getTestData = () => {
      return this.getData('test.json')
  }
}

const renderCard = response => {
    console.log(response);
    tvShowsList.textContent = '';

    response.results.forEach(item => {

        const { 
          backdrop_path: backdrop, 
          name: title, 
          poster_path: poster, 
          vote_average:vote
        } = item
        
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = '';
        const voteValue = '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" class="tv-card">
          <span class="tv-card__vote">${vote}</span>
          <img class="tv-card__img"
              src="${posterIMG}"
              data-backdrop="${IMG_URL + backdrop}"
              alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        tvShowsList.insertAdjacentElement('afterbegin', card);
        console.log(card);
    });
};
new DBService().getTestData().then(renderCard);



//Open/ Close Menu

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', event => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

//Open Modal Window
tvShowsList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if (card) {
        document.body.style.overflow= 'hidden';
        modal.classList.remove('hide');
    }
});

//Close Modal Window
modal.addEventListener('click', event => {
    console.log(event.target.closest('.cross'));

    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow= '';
        modal.classList.add('hide'); 
    }
});

//Change Cards
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
      const img = card.querySelector('.tv-card__img'); 
      /*const changeImg = img.dataset.backdrop;

      if (changeImg){
        img.dataset.backdrop = img.src;
        img.src = changeImg;
      }*/

      if (img.dataset.backdrop) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
      }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
