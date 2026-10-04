const trendingGrid = document.getElementById("trendingGrid");
const tvGrid = document.getElementById("tvGrid");
const watchlistGrid = document.getElementById("watchlistGrid");

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchResultsSection = document.getElementById("searchResultsSection");
const searchEmptyState = document.getElementById("searchEmptyState");
const trendingSection = document.getElementById("trendingSection");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const detailsModal = document.getElementById("detailsModal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalYear = document.getElementById("modalYear");
const modalRuntime = document.getElementById("modalRuntime");
const modalDescription = document.getElementById("modalDescription");
const modalGenres = document.getElementById("modalGenres");
const modalType = document.getElementById("modalType");
const modalDirector = document.getElementById("modalDirector");
const modalReleaseDate = document.getElementById("modalReleaseDate");

const modalPoster = document.getElementById("modalPoster");
const modalBackdrop = document.getElementById("modalBackdrop");

const modalWatchlistBtn = document.getElementById("modalWatchlistBtn");
const modalCompleteBtn = document.getElementById("modalCompleteBtn");

const heroWatchlistBtn = document.getElementById("heroWatchlistBtn");
const heroDetailsBtn = document.getElementById("heroDetailsBtn");

const wantCount = document.getElementById("wantCount");
const completedCount = document.getElementById("completedCount");

const watchlistEmpty = document.getElementById("watchlistEmpty");

const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");


/*
|--------------------------------------------------------------------------
| TMDB CONFIGURATION
|--------------------------------------------------------------------------
|
| We will add your TMDB API later.
|
| Example:
|
| const TMDB_API_KEY = "YOUR_API_KEY";
| const TMDB_BASE_URL = "https://api.themoviedb.org/3";
| const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
|
*/


/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| This data is only here so the interface works before the TMDB API
| is connected.
|
| Image fields have intentionally been left empty.
|
*/

const trendingMovies = [
    {
        id: 1,
        title: "Beyond the Unknown",
        type: "movie",
        year: "2026",
        rating: 8.7,
        genre: "Sci-Fi",
        genres: ["Sci-Fi", "Adventure"],
        runtime: "2h 10m",
        director: "Director Name",
        releaseDate: "March 14, 2026",
        description:
            "A gripping story about adventure, mystery, and survival beyond everything humanity has ever known.",
        poster: "",
        backdrop: ""
    },

    {
        id: 2,
        title: "Midnight Echo",
        type: "movie",
        year: "2025",
        rating: 8.4,
        genre: "Thriller",
        genres: ["Thriller", "Mystery"],
        runtime: "1h 54m",
        director: "Director Name",
        releaseDate: "November 8, 2025",
        description:
            "A journalist investigating a forgotten case discovers that the truth may be closer to home than expected.",
        poster: "",
        backdrop: ""
    },

    {
        id: 3,
        title: "The Last Horizon",
        type: "movie",
        year: "2026",
        rating: 7.9,
        genre: "Drama",
        genres: ["Drama", "Adventure"],
        runtime: "2h 04m",
        director: "Director Name",
        releaseDate: "January 22, 2026",
        description:
            "A fractured family embarks on one final journey across an unforgiving landscape.",
        poster: "",
        backdrop: ""
    },

    {
        id: 4,
        title: "Silent Territory",
        type: "movie",
        year: "2025",
        rating: 8.8,
        genre: "Crime",
        genres: ["Crime", "Thriller"],
        runtime: "2h 16m",
        director: "Director Name",
        releaseDate: "October 3, 2025",
        description:
            "Two detectives uncover an underground operation hidden beneath a quiet coastal city.",
        poster: "",
        backdrop: ""
    },

    {
        id: 5,
        title: "Parallel",
        type: "movie",
        year: "2026",
        rating: 7.6,
        genre: "Sci-Fi",
        genres: ["Sci-Fi", "Mystery"],
        runtime: "1h 57m",
        director: "Director Name",
        releaseDate: "June 17, 2026",
        description:
            "A scientist discovers a doorway connecting her world to another version of reality.",
        poster: "",
        backdrop: ""
    }
];


const popularTVShows = [
    {
        id: 101,
        title: "The Divide",
        type: "tv",
        year: "2026",
        rating: 8.2,
        genre: "Drama",
        genres: ["Drama", "Mystery"],
        runtime: "8 Episodes",
        director: "Creator Name",
        releaseDate: "February 5, 2026",
        description:
            "Two communities separated by a mysterious boundary begin uncovering the truth behind their existence.",
        poster: "",
        backdrop: ""
    },

    {
        id: 102,
        title: "After Dark",
        type: "tv",
        year: "2025",
        rating: 8.6,
        genre: "Crime",
        genres: ["Crime", "Drama"],
        runtime: "10 Episodes",
        director: "Creator Name",
        releaseDate: "September 11, 2025",
        description:
            "A detective navigates the hidden world of a city that changes completely after midnight.",
        poster: "",
        backdrop: ""
    },

    {
        id: 103,
        title: "Northbound",
        type: "tv",
        year: "2026",
        rating: 7.8,
        genre: "Adventure",
        genres: ["Adventure", "Drama"],
        runtime: "9 Episodes",
        director: "Creator Name",
        releaseDate: "April 19, 2026",
        description:
            "A group of strangers travels north following clues to a location that officially does not exist.",
        poster: "",
        backdrop: ""
    },

    {
        id: 104,
        title: "Legacy",
        type: "tv",
        year: "2025",
        rating: 9.0,
        genre: "Drama",
        genres: ["Drama"],
        runtime: "12 Episodes",
        director: "Creator Name",
        releaseDate: "December 2, 2025",
        description:
            "A powerful family fights to preserve an empire while buried secrets threaten everything they built.",
        poster: "",
        backdrop: ""
    },

    {
        id: 105,
        title: "Zero Hour",
        type: "tv",
        year: "2026",
        rating: 8.3,
        genre: "Action",
        genres: ["Action", "Thriller"],
        runtime: "8 Episodes",
        director: "Creator Name",
        releaseDate: "May 25, 2026",
        description:
            "An intelligence team has twelve hours to prevent an attack that could change the world forever.",
        poster: "",
        backdrop: ""
    }
];


const allTitles = [
    ...trendingMovies,
    ...popularTVShows
];


/*
|--------------------------------------------------------------------------
| WATCHLIST STATE
|--------------------------------------------------------------------------
*/

let watchlist = JSON.parse(
    localStorage.getItem("cinevaultWatchlist")
) || [];

let completed = JSON.parse(
    localStorage.getItem("cinevaultCompleted")
) || [];

let activeWatchlistTab = "wantToWatch";

let selectedTitle = trendingMovies[0];


/*
|--------------------------------------------------------------------------
| SAVE LOCAL STORAGE
|--------------------------------------------------------------------------
*/

function saveLists() {
    localStorage.setItem(
        "cinevaultWatchlist",
        JSON.stringify(watchlist)
    );

    localStorage.setItem(
        "cinevaultCompleted",
        JSON.stringify(completed)
    );
}


/*
|--------------------------------------------------------------------------
| CREATE MOVIE CARD
|--------------------------------------------------------------------------
*/

function createMovieCard(item, watchlistMode = false) {

    const card = document.createElement("article");

    card.className = "movie-card";

    const isSaved = watchlist.some(
        savedItem => savedItem.id === item.id
    );

    let actions = "";

    if (watchlistMode) {

        if (activeWatchlistTab === "wantToWatch") {

            actions = `
        <div class="watchlist-card-actions">

          <button
            class="complete-card-btn"
            data-complete-id="${item.id}"
          >
            Mark Complete
          </button>

          <button
            data-remove-id="${item.id}"
          >
            Remove
          </button>

        </div>
      `;

        } else {

            actions = `
        <div class="watchlist-card-actions">

          <button
            data-move-back-id="${item.id}"
          >
            Watch Again
          </button>

          <button
            data-remove-completed-id="${item.id}"
          >
            Remove
          </button>

        </div>
      `;

        }
    }


    card.innerHTML = `

    <div class="poster-wrap" data-details-id="${item.id}">

      ${item.poster
            ? `<img src="${item.poster}" alt="${item.title}">`
            : `<div class="poster-placeholder"></div>`
        }

      ${!watchlistMode
            ? `
            <button
              class="card-save ${isSaved ? "saved" : ""}"
              data-save-id="${item.id}"
              aria-label="Save ${item.title}"
            >
              ${isSaved ? "✓" : "+"}
            </button>
          `
            : ""
        }

      <div class="poster-hover">

        <button class="details-circle">
          →
        </button>

      </div>

    </div>


    <div class="movie-info">

      <h3 class="movie-title">
        ${item.title}
      </h3>

      <div class="movie-meta">

        <span>
          ${item.year}
        </span>

        <span class="movie-rating">
          <span class="star">★</span>
          ${item.rating}
        </span>

      </div>

      ${actions}

    </div>
  `;

    return card;
}


/*
|--------------------------------------------------------------------------
| RENDER STANDARD SECTIONS
|--------------------------------------------------------------------------
*/

function renderMovieGrid(items, container) {

    container.innerHTML = "";

    items.forEach(item => {

        const card = createMovieCard(item);

        container.appendChild(card);

    });

}


renderMovieGrid(
    trendingMovies,
    trendingGrid
);

renderMovieGrid(
    popularTVShows,
    tvGrid
);


/*
|--------------------------------------------------------------------------
| FIND TITLE
|--------------------------------------------------------------------------
*/

function findTitleById(id) {

    const numberId = Number(id);

    return (
        allTitles.find(item => item.id === numberId) ||
        watchlist.find(item => item.id === numberId) ||
        completed.find(item => item.id === numberId)
    );

}


/*
|--------------------------------------------------------------------------
| WATCHLIST
|--------------------------------------------------------------------------
*/

function addToWatchlist(item) {

    const alreadySaved = watchlist.some(
        title => title.id === item.id
    );

    if (alreadySaved) {

        watchlist = watchlist.filter(
            title => title.id !== item.id
        );

    } else {

        watchlist.push({
            ...item,
            addedAt: Date.now()
        });

        completed = completed.filter(
            title => title.id !== item.id
        );

    }

    saveLists();

    refreshUI();
}


function markCompleted(item) {

    watchlist = watchlist.filter(
        title => title.id !== item.id
    );

    const alreadyCompleted = completed.some(
        title => title.id === item.id
    );

    if (!alreadyCompleted) {

        completed.push({
            ...item,
            addedAt: Date.now()
        });

    }

    saveLists();

    refreshUI();
}


function moveBackToWatchlist(item) {

    completed = completed.filter(
        title => title.id !== item.id
    );

    if (
        !watchlist.some(
            title => title.id === item.id
        )
    ) {

        watchlist.push({
            ...item,
            addedAt: Date.now()
        });

    }

    saveLists();

    refreshUI();
}


function removeFromCompleted(id) {

    completed = completed.filter(
        title => title.id !== Number(id)
    );

    saveLists();

    refreshUI();
}


/*
|--------------------------------------------------------------------------
| RENDER WATCHLIST
|--------------------------------------------------------------------------
*/

function renderWatchlist() {

    let titles =
        activeWatchlistTab === "wantToWatch"
            ? [...watchlist]
            : [...completed];

    const selectedType = typeFilter.value;

    if (selectedType !== "all") {

        titles = titles.filter(
            item => item.type === selectedType
        );

    }


    const selectedSort = sortFilter.value;

    if (selectedSort === "rating") {

        titles.sort(
            (a, b) => b.rating - a.rating
        );

    }

    if (selectedSort === "title") {

        titles.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    }

    if (selectedSort === "recent") {

        titles.sort(
            (a, b) =>
                (b.addedAt || 0) - (a.addedAt || 0)
        );

    }


    watchlistGrid.innerHTML = "";


    if (!titles.length) {

        watchlistEmpty.classList.remove("hidden");
        watchlistGrid.classList.add("hidden");

    } else {

        watchlistEmpty.classList.add("hidden");
        watchlistGrid.classList.remove("hidden");

        titles.forEach(item => {

            const card = createMovieCard(
                item,
                true
            );

            watchlistGrid.appendChild(card);

        });

    }


    wantCount.textContent = watchlist.length;
    completedCount.textContent = completed.length;

}


/*
|--------------------------------------------------------------------------
| DETAILS MODAL
|--------------------------------------------------------------------------
*/

function openDetails(item) {

    if (!item) return;

    selectedTitle = item;

    modalTitle.textContent = item.title;

    modalRating.textContent = item.rating;

    modalYear.textContent = item.year;

    modalRuntime.textContent =
        item.runtime || "";

    modalDescription.textContent =
        item.description || "";

    modalDirector.textContent =
        item.director || "Not available";

    modalReleaseDate.textContent =
        item.releaseDate || item.year;

    modalType.textContent =
        item.type === "tv"
            ? "TV SHOW"
            : "MOVIE";


    modalPoster.src = item.poster || "";

    modalBackdrop.src = item.backdrop || "";


    modalGenres.innerHTML = "";

    const genres =
        item.genres ||
        [item.genre];

    genres.forEach(genre => {

        const genreElement =
            document.createElement("span");

        genreElement.textContent = genre;

        modalGenres.appendChild(
            genreElement
        );

    });


    updateModalButtons();

    detailsModal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal() {

    detailsModal.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );

}


function updateModalButtons() {

    const inWatchlist = watchlist.some(
        item => item.id === selectedTitle.id
    );

    const isCompleted = completed.some(
        item => item.id === selectedTitle.id
    );


    modalWatchlistBtn.textContent =
        inWatchlist
            ? "✓ In Watchlist"
            : "+ Add to Watchlist";


    modalCompleteBtn.textContent =
        isCompleted
            ? "✓ Completed"
            : "Mark Completed";

}


/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/

function handleSearch() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        clearSearch();

        return;
    }


    const results = allTitles.filter(item => {

        return (
            item.title
                .toLowerCase()
                .includes(query) ||

            item.genre
                .toLowerCase()
                .includes(query)
        );

    });


    searchResultsSection.classList.remove(
        "hidden"
    );

    trendingSection.classList.add(
        "hidden"
    );


    searchResults.innerHTML = "";


    if (!results.length) {

        searchResults.classList.add("hidden");

        searchEmptyState.classList.remove(
            "hidden"
        );

    } else {

        searchResults.classList.remove("hidden");

        searchEmptyState.classList.add(
            "hidden"
        );

        results.forEach(item => {

            searchResults.appendChild(
                createMovieCard(item)
            );

        });

    }

}


function clearSearch() {

    searchInput.value = "";

    searchResultsSection.classList.add(
        "hidden"
    );

    trendingSection.classList.remove(
        "hidden"
    );

    searchResults.innerHTML = "";

}


/*
|--------------------------------------------------------------------------
| REFRESH UI
|--------------------------------------------------------------------------
*/

function refreshUI() {

    renderMovieGrid(
        trendingMovies,
        trendingGrid
    );

    renderMovieGrid(
        popularTVShows,
        tvGrid
    );

    renderWatchlist();

    if (
        detailsModal.classList.contains(
            "active"
        )
    ) {

        updateModalButtons();

    }


    const heroSaved = watchlist.some(
        item =>
            item.id === trendingMovies[0].id
    );


    heroWatchlistBtn.innerHTML =
        heroSaved
            ? "✓ In Watchlist"
            : "<span>+</span> Add to Watchlist";

}


/*
|--------------------------------------------------------------------------
| GENERAL CLICK EVENTS
|--------------------------------------------------------------------------
*/

document.addEventListener(
    "click",
    function (event) {

        const saveButton =
            event.target.closest(
                "[data-save-id]"
            );


        if (saveButton) {

            event.stopPropagation();

            const item = findTitleById(
                saveButton.dataset.saveId
            );

            addToWatchlist(item);

            return;

        }


        const detailsTarget =
            event.target.closest(
                "[data-details-id]"
            );


        if (detailsTarget) {

            const item = findTitleById(
                detailsTarget.dataset.detailsId
            );

            openDetails(item);

            return;

        }


        const completeButton =
            event.target.closest(
                "[data-complete-id]"
            );


        if (completeButton) {

            const item = findTitleById(
                completeButton.dataset.completeId
            );

            markCompleted(item);

            return;

        }


        const removeButton =
            event.target.closest(
                "[data-remove-id]"
            );


        if (removeButton) {

            const id = Number(
                removeButton.dataset.removeId
            );

            watchlist = watchlist.filter(
                item => item.id !== id
            );

            saveLists();

            refreshUI();

            return;

        }


        const moveBackButton =
            event.target.closest(
                "[data-move-back-id]"
            );


        if (moveBackButton) {

            const item = findTitleById(
                moveBackButton.dataset.moveBackId
            );

            moveBackToWatchlist(item);

            return;

        }


        const removeCompletedButton =
            event.target.closest(
                "[data-remove-completed-id]"
            );


        if (removeCompletedButton) {

            removeFromCompleted(
                removeCompletedButton
                    .dataset
                    .removeCompletedId
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| WATCHLIST TABS
|--------------------------------------------------------------------------
*/

document
    .querySelectorAll(".watchlist-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".watchlist-tab"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );


                this.classList.add("active");

                activeWatchlistTab =
                    this.dataset.tab;

                renderWatchlist();

            }
        );

    });


/*
|--------------------------------------------------------------------------
| COMPLETED NAVIGATION
|--------------------------------------------------------------------------
*/

document
    .querySelectorAll(
        "[data-open-completed]"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                activeWatchlistTab =
                    "completed";

                document
                    .querySelectorAll(
                        ".watchlist-tab"
                    )
                    .forEach(tab => {

                        tab.classList.toggle(
                            "active",
                            tab.dataset.tab ===
                            "completed"
                        );

                    });

                renderWatchlist();

            }
        );

    });


/*
|--------------------------------------------------------------------------
| FILTERS
|--------------------------------------------------------------------------
*/

typeFilter.addEventListener(
    "change",
    renderWatchlist
);

sortFilter.addEventListener(
    "change",
    renderWatchlist
);


/*
|--------------------------------------------------------------------------
| MODAL EVENTS
|--------------------------------------------------------------------------
*/

modalClose.addEventListener(
    "click",
    closeModal
);


detailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === detailsModal
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


modalWatchlistBtn.addEventListener(
    "click",
    function () {

        addToWatchlist(
            selectedTitle
        );

    }
);


modalCompleteBtn.addEventListener(
    "click",
    function () {

        if (
            completed.some(
                item =>
                    item.id === selectedTitle.id
            )
        ) {

            return;

        }

        markCompleted(
            selectedTitle
        );

    }
);


/*
|--------------------------------------------------------------------------
| HERO EVENTS
|--------------------------------------------------------------------------
*/

heroDetailsBtn.addEventListener(
    "click",
    function () {

        openDetails(
            trendingMovies[0]
        );

    }
);


heroWatchlistBtn.addEventListener(
    "click",
    function () {

        addToWatchlist(
            trendingMovies[0]
        );

    }
);


/*
|--------------------------------------------------------------------------
| SEARCH EVENTS
|--------------------------------------------------------------------------
*/

searchInput.addEventListener(
    "input",
    handleSearch
);


clearSearchBtn.addEventListener(
    "click",
    clearSearch
);


/*
|--------------------------------------------------------------------------
| MOBILE MENU
|--------------------------------------------------------------------------
*/

mobileMenuBtn.addEventListener(
    "click",
    function () {

        mobileMenu.classList.toggle(
            "active"
        );

    }
);


mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                mobileMenu.classList.remove(
                    "active"
                );

            }
        );

    });


/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

refreshUI();