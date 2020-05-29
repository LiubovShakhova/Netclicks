//Menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '4bc8f24c60123ebaf470e476b9cf276c';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    modalContent = document.querySelector('.modal__content'),
    pagination = document.querySelector('.pagination');


const loading = document.createElement('div');
loading.className = 'loading';

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
          throw new Error(`Files can not be found here ${url}`);
      }
  }

  getTestData = () => {
      return this.getData('test.json');
  }

  getTestCard = () => {
    return this.getData('card.json');
  }

  getSearchResult = query => {
    this.temp = `${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`;
    return this.getData(this.temp);
  }

  getNextPage = page => {
    return this.getData(this.temp + '&page=' + page);
  }

  getTvShow = id => {
    return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=en-US`);
  
}
  getTopRated = () => this.getData(`${SERVER}/tv/top_rated?api_key=${API_KEY}&language=en-US`);

  getPopular = () => this.getData(`${SERVER}/tv/popular?api_key=${API_KEY}&language=en-US`);

  getToday = () => this.getData(`${SERVER}/tv/airing_today?api_key=${API_KEY}&language=en-US`);

  getWeek = () => this.getData(`${SERVER}/tv/on_the_air?api_key=${API_KEY}&language=en-US`);
}

const dbService = new DBService();

console.log(new DBService().getSearchResult('Star Wars'));

const renderCard = (response, target) => {

    tvShowsList.textContent = '';
    console.log(response);

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'We are sorry,but nothing was found...';
        tvShowsHead.style.cssText = 'color:pink; border-bottom: 3px dotted pink;';
        return;
    }

        tvShowsHead.textContent = target? target.textContent : 'Результат поиска:';
        tvShowsHead.style.cssText = 'color:silver; border-bottom: none;';

    response.results.forEach(item => {

        const { 
          backdrop_path: backdrop, 
          name: title, 
          poster_path: poster, 
          vote_average: vote,
          id
        } = item;
        
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');

        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
          ${voteValue}
          <img class="tv-card__img"
              src="${posterIMG}"
              data-backdrop="${backdropIMG}"
              alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
        </a>
        `;

        loading.remove();
        tvShowsList.insertAdjacentElement('afterbegin', card);
        
    });

    pagination.textContent = '';

    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
        }
    }
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if(value) {
      tvShows.append(loading);
      dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
    
    
});


//Open/ Close Menu

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
}

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
});

document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    closeDropdown();
  }
});

leftMenu.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
      dbService.getTopRated().then((response) => renderCard(response, target));
  }

  if (target.closest('#popular')) {
    tvShows.append(loading);
    dbService.getPopular().then((response) => renderCard(response, target));
  }

  if (target.closest('#week')) {
    tvShows.append(loading);
    dbService.getWeek().then((response) => renderCard(response, target));
  }

  if (target.closest('#today')) {
    tvShows.append(loading);
    dbService.getToday().then((response) => renderCard(response, target));
  }

  if (target.closest('#search')) {
      tvShowsList.textContent = '';
      tvShowsHead.textContent = '';
  }
});


//Open Modal Window
tvShowsList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if (card) {

        preloader.style.display = 'block';
        dbService.getTvShow(card.id)
        .then(data => {

           /*if (posterPath) {
              tvCardImg.src = IMG_URL + data.poster_path;
              posterWrapper.style.display = '';
              modalContent.style.paddingLeft = '' ;   
            } else {
                posterWrapper.style.display = 'none';
                modalContent.style.paddingLeft = '25px';           
            }*/
            
            modalTitle.textContent = data.name;

            genresList.textContent = '';
            //genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
            //for (const item of data.genres) {
                //genresList.innerHTML += `<li>${item.name}</li>`
            //}

            data.genres.forEach(item => {
              genresList.innerHTML += `<li>${item.name}</li>`;
            });

            rating.textContent = data.vote_average;
            description.textContent = data.overview;
            modalLink.href = data.homepage;
        })
        .then(() => {
          document.body.style.overflow= 'hidden';
          modal.classList.remove('hide');
        })  
        .finally(()=> {
          preloader.style.display = '';
        })
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

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});
