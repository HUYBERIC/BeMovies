// --- D O M   C O N T E N T   L O A D E D --- ///

document.addEventListener('DOMContentLoaded', () => {


// --- A P I   K E Y & V A R --- ///

const API_KEY = 'bb2d4bb3442155c7825d32d6e0fef7e8';

// --- A P I --- //



/* ___ s e a r c h - d a t a ___ */

const searchButton = document.querySelector('.searchBar button');
const searchInput = document.querySelector('.searchBar input');

const firstSection = document.querySelector('.first-section')
let container;
let swiperTitleSearchedMovie;
let swiperSearch;
let swiperWrapper;
let swiperButtonPrev;
let arrowL;
let swiperButtonNext;
let arrowR;

function DomCreate(){
    firstSection.innerHTML = '';

    container = document.createElement('div');
    container.classList.add('container');
    firstSection.appendChild(container);

    swiperTitleSearchedMovie = document.createElement('p');
    swiperTitleSearchedMovie.classList.add('swiper-title','searchedMovie')
    container.appendChild(swiperTitleSearchedMovie);

    swiperSearch = document.createElement('div');
    swiperSearch.id = 'searchSwiper';
    swiperSearch.classList.add('swiper');
    container.appendChild(swiperSearch);

    swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperSearch.appendChild(swiperWrapper);

    swiperButtonPrev = document.createElement('div');
    swiperButtonPrev.classList.add('swiper-button-prev')
    swiperSearch.appendChild(swiperButtonPrev);

    arrowL = document.createElement('img')
    arrowL.src = 'img/arrowL.svg';
    swiperButtonPrev.appendChild(arrowL);

    swiperButtonNext = document.createElement('div');
    swiperButtonNext.classList.add('swiper-button-next')
    swiperSearch.appendChild(swiperButtonNext);

    arrowR = document.createElement('img')
    arrowR.src = 'img/arrowR.svg';
    swiperButtonNext.appendChild(arrowR);
}

async function fetchMoviesByTitle(query) {
    if (!query.trim()){
        if (container) firstSection.removeChild(container);
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjJkNGJiMzQ0MjE1NWM3ODI1ZDMyZDZlMGZlZjdlOCIsIm5iZiI6MTczMDkwMTEyOS44NTI3NjY1LCJzdWIiOiI2NzI4Y2EyN2E3MDJmY2EyMmYwYmM3ODciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6ow70mjwixIHRgwMtXtoUxQYbxzrqoUQUqHjDor7smc'
        }
    };

    DomCreate();

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&page=1`, options);
    const data = await response.json();

    if(data.results){
        swiperTitleSearchedMovie.textContent = `Result for "${query}"`;
        data.results.forEach(movie => {
            if(movie.poster_path){
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            slide.appendChild(img);

            const movieInfo = createMovieInfo(movie);
            slide.appendChild(movieInfo);

            swiperWrapper.appendChild(slide);

            }
        });

        const searchSwiper = new Swiper('#searchSwiper', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: -15,
            // Navigation arrows
            navigation: {
                nextEl: '#searchSwiper .swiper-button-next',
                prevEl: '#searchSwiper .swiper-button-prev',
            },
        });

        searchSwiper.update();
    } else {
        console.error('No results found');
    }
};


function handleSearch(){
    firstSection.classList.remove('hidden');
    const query = searchInput.value;
    fetchMoviesByTitle(query)
    firstSection.style.marginBottom = '100px';
}

searchButton.addEventListener('click', handleSearch)
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        handleSearch();
    }
});


/* ___ l a t e s t - d a t a ___ */

const swiperLatest = document.querySelector('#latestSwiper .swiper-wrapper');
async function fetchMovies(page = 1) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjJkNGJiMzQ0MjE1NWM3ODI1ZDMyZDZlMGZlZjdlOCIsIm5iZiI6MTczMDkwMTEyOS44NTI3NjY1LCJzdWIiOiI2NzI4Y2EyN2E3MDJmY2EyMmYwYmM3ODciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6ow70mjwixIHRgwMtXtoUxQYbxzrqoUQUqHjDor7smc'
        }
    };
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?page=${page}`, options);
    const data = await response.json();
    return data.results;
}

async function loadMovies() {
    const allMovies = [];

    // Load more pages
    for (let i = 1; i <= 5; i++) {
        const movies = await fetchMovies(i);
        allMovies.push(...movies);
    }
    
    // Load movies in the swiper
    allMovies.forEach(movie => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        slide.appendChild(img);

        const movieInfo = createMovieInfo(movie);
        slide.appendChild(movieInfo);

        swiperLatest.appendChild(slide);
    });

    latestSwiper.update(); // Keep the swiper update
}

// If error
loadMovies().catch(err => console.error('Error', err));

/* ___ g e n r e s - d a t a ___ */

const swiperGenres = document.querySelector('#genresSwiper .swiper-wrapper');
const genreButtons = document.querySelectorAll('.genre');
const genreChoice = document.querySelector('.genreChoice');

async function fetchMoviesByGenre(genreId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjJkNGJiMzQ0MjE1NWM3ODI1ZDMyZDZlMGZlZjdlOCIsIm5iZiI6MTczMDkwMTEyOS44NTI3NjY1LCJzdWIiOiI2NzI4Y2EyN2E3MDJmY2EyMmYwYmM3ODciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6ow70mjwixIHRgwMtXtoUxQYbxzrqoUQUqHjDor7smc'
        }
};
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`, options);
    const data = await response.json();
    return data.results;
}

async function updateMoviesByGenre(genreId, genreName) {
    console.log(`updateMoviesByGenre appelé avec genreId: ${genreId}, genreName: ${genreName}`);
    const movies = await fetchMoviesByGenre(genreId);
    console.log("Films récupérés :", movies);

    genreChoice.textContent = `Results for "${genreName}"`;
    swiperGenres.innerHTML = '';

    movies.forEach(movie => {
        if (movie.poster_path) {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            slide.appendChild(img);

            const movieInfo = createMovieInfo(movie);
            slide.appendChild(movieInfo);

            swiperGenres.appendChild(slide);
        }
    });
    genresSwiper.update();
}

genreButtons.forEach(button => {
    button.addEventListener('click', () => {
    genreButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const genreId = button.dataset.genreId;
    const genreName = button.textContent;

    updateMoviesByGenre(genreId, genreName);
});
});

// Comedy default genre
setTimeout(() => {
const defaultGenreButton = document.querySelector('.genre.active');
console.log("État du genre par défaut :", defaultGenreButton);
if (defaultGenreButton){
    const genreId = defaultGenreButton.dataset.genreId;
    const genreName = defaultGenreButton.textContent;

    console.log("Genre par défaut trouvé :", genreName, genreId);

    updateMoviesByGenre(genreId, genreName);

}else {
    console.log("Aucun genre par défaut trouvé.");
}
}, 100);

/* ___ h o v e r - d a t a ___ */

let genreMap = {};

async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        // Fill genreMap with API's genres
        data.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
    } catch (error) {
        console.error('Error', error);
    }
}

fetchGenres();

function getGenreNames(genreIds){
    return genreIds.map(id => genreMap[id]).join(', ');
}

function createMovieInfo(movie) {

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');
    movieInfo.setAttribute('data-movie-id', movie.id);
    
    const movieTitle = document.createElement('div');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = movie.title;

    const movieYear = document.createElement('div');
    movieYear.classList.add('movie-year');
    movieYear.textContent = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

    const movieGenre = document.createElement('div');
    movieGenre.classList.add('movie-genre');
    movieGenre.textContent = getGenreNames(movie.genre_ids);

    const movieStar = document.createElement('img');
    movieStar.classList.add('movie-star');
    movieStar.src = 'img/star-rating.png';
    movieStar.alt = 'Star Rating';

    const movieRating = document.createElement('div');
    movieRating.classList.add('movie-rating');
    movieRating.textContent = movie.vote_average.toFixed(1) || 'N/A';

    
    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieYear);
    movieInfo.appendChild(movieGenre);
    movieInfo.appendChild(movieStar);
    movieInfo.appendChild(movieRating);

    return movieInfo;
}



// --- S W I P E R --- //

/* ___ s w i p e r - l a t e s t ___ */

const latestSwiper = new Swiper('#latestSwiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: -15,
    // Navigation arrows
    navigation: {
        nextEl: '#latestSwiper .swiper-button-next',
        prevEl: '#latestSwiper .swiper-button-prev',
    },
});

/* ___ s w i p e r - g e n r e s ___ */

const genresSwiper = new Swiper('#genresSwiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: -15,
    // Navigation arrows
    navigation: {
        nextEl: '#genresSwiper .swiper-button-next',
        prevEl: '#genresSwiper .swiper-button-prev',
    },
});


/* ___ m o d a l   l o g & r e g i s t e r ___ */

// --- V A R I A B L E S --- ///

const modalLogSection = document.querySelector('.modal-log-section');
const overlay = document.querySelector('#overlay');
const closingModal = document.querySelector('.closing-modal');
const switchBtn = document.querySelector('.switchBtn');
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const backSignup = document.querySelector('#back-signup');
const backLogin = document.querySelector('#back-login');
const switchToSignup = document.querySelector('#switch-to-signup');
const modalLogRegister = document.querySelector('#modalLogRegister');
const modalLogSignin = document.querySelector('#modalLogSignin');
const modalLogFooterRegister = document.querySelector('#modalLogFooterRegister');
const modalLogFooterSignin = document.querySelector('#modalLogFooterSignin');

// --- F U N C T I O N S --- ///

function showModalSignup(event) {
    event.preventDefault();
    modalLogSection.classList.remove('hidden');
    overlay.classList.remove('hidden');
    backSignup.classList.add('active');
    backLogin.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    document.documentElement.classList.add('no-scroll');
}

function showModalLogin(event) {
    event.preventDefault();
    modalLogSection.classList.remove('hidden');
    overlay.classList.remove('hidden');
    backLogin.classList.add('active');
    backSignup.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    document.documentElement.classList.add('no-scroll');
}

function hideModal() {
    modalLogSection.classList.add('hidden');
    overlay.classList.add('hidden');
    signupForm.reset();
    loginForm.reset();
    document.documentElement.classList.remove('no-scroll');
}

/* ___ m o d a l   p o p u p M o d a l ___ */

// --- V A R I A B L E S --- ///

const modalPopupMovie = document.querySelector('.modal-popup-movie');
const overlayPopup = document.querySelector('.overlay.popup');
const closingModalPop = document.querySelector('.closing-modal.popup');
const popupImg = document.querySelector('.popup-img');
const movieTitle = document.querySelector('.movieTitle');
const movieYear = document.querySelector('.movieYear');
const movieRate = document.querySelector('.movieRate');
const movieGenre = document.querySelector('.movieGenre');
const movieResume = document.querySelector('.movieResume');
const movieCast = document.querySelector('.movieCast');

// --- F U N C T I O N S --- ///

function showModalPopup() {
    modalPopupMovie.classList.remove('hidden');
    overlayPopup.classList.remove('hidden');
}

function hideModalPopup() {
    modalPopupMovie.classList.add('hidden');
    overlayPopup.classList.add('hidden');
}

function createMovieModalInfo(movie) {
    popupImg.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`;
    movieTitle.textContent = movie.title;
    movieYear.textContent = movie.release_date.split('-')[0];
    movieRate.textContent = `★ ${movie.vote_average.toFixed(1)}`;
    movieGenre.textContent = movie.genres.map(genre => genre.name).join(', ');
    movieResume.textContent = movie.overview;
}

async function fetchMovieDetails(movieId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjJkNGJiMzQ0MjE1NWM3ODI1ZDMyZDZlMGZlZjdlOCIsIm5iZiI6MTczMDkwMTEyOS44NTI3NjY1LCJzdWIiOiI2NzI4Y2EyN2E3MDJmY2EyMmYwYmM3ODciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6ow70mjwixIHRgwMtXtoUxQYbxzrqoUQUqHjDor7smc'
        }
};
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?`, options);
        const data = await response.json();
        console.log('Movie data:', data);
        
        createMovieModalInfo(data);

        await fetchCast(movieId);

        showModalPopup();
    } catch (error) {
        console.error('Error :', error);
    }
}

async function fetchCast(movieId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjJkNGJiMzQ0MjE1NWM3ODI1ZDMyZDZlMGZlZjdlOCIsIm5iZiI6MTczMDkwMTEyOS44NTI3NjY1LCJzdWIiOiI2NzI4Y2EyN2E3MDJmY2EyMmYwYmM3ODciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6ow70mjwixIHRgwMtXtoUxQYbxzrqoUQUqHjDor7smc'
        }
};
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?`, options);
        const data = await response.json();

        const cast = data.cast.slice(0, 4).map(member => member.name).join(', ');
        movieCast.textContent = `CAST: ${cast}`;
    } catch(error) {
        console.error('Error :', error);
    }
    };

    document.addEventListener('click', (event) => {
        const card = event.target.closest('.movie-info');
        if (card) {
            const movieId = card.dataset.movieId;
            fetchMovieDetails(movieId);
        }
    });

closingModalPop.addEventListener('click', hideModalPopup);
overlayPopup.addEventListener('click', hideModalPopup);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideModalPopup();
});

// --- E V E N T   L I S T E N E R --- //

modalLogRegister.addEventListener('click', showModalSignup);
modalLogSignin.addEventListener('click', showModalLogin);

modalLogFooterRegister.addEventListener('click', showModalSignup);
modalLogFooterSignin.addEventListener('click', showModalLogin);

closingModal.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideModal();
});

backSignup.addEventListener('click', () => {
    backSignup.classList.add('active');
    backLogin.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

backLogin.addEventListener('click', () => {
    backLogin.classList.add('active');
    backSignup.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

switchToSignup.addEventListener('click', () => {
    backSignup.click();
});

// --- D O M   C O N T E N T   L O A D E D --- ///

});