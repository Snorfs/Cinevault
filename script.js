const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";

/*
Paste your TMDB API Read Access Token below.

Example:
const TMDB_TOKEN = "YOUR_TOKEN_HERE";
*/

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODMxMTM1NTY2ZDc1MDRjYmI1ZTFmZTI5N2EwNTZmZSIsIm5iZiI6MTc5MTEzMjk5Mi45MjYsInN1YiI6IjZhYzI4NTQwYWJhNWQ2ODg0ODAzYzA3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2pUu9IJDZOJlCTKxxNB0fiUtj0ZvMUJTSZdzq32KZnQ";

const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};


/* =========================
   HTML ELEMENTS
========================= */

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

const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroRating = document.getElementById("heroRating");
const heroYear = document.getElementById("heroYear");
const heroGenre = document.getElementById("heroGenre");
const heroImage = document.getElementById("heroImage");

const wantCount = document.getElementById("wantCount");
const completedCount = document.getElementById("completedCount");

const watchlistEmpty = document.getElementById("watchlistEmpty");

const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");


/* =========================
   APP DATA
========================= */

let trendingMovies = [];
let popularTVShows = [];
let allTitles = [];

let selectedTitle = null;

let activeWatchlistTab = "wantToWatch";

let watchlist =
  JSON.parse(
    localStorage.getItem("cinevaultWatchlist")
  ) || [];

let completed =
  JSON.parse(
    localStorage.getItem("cinevaultCompleted")
  ) || [];

let searchTimeout;


/* =========================
   TMDB FETCH FUNCTION
========================= */

async function fetchFromTMDB(endpoint) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}`,
      tmdbOptions
    );

    if (!response.ok) {
      throw new Error(
        `TMDB request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("TMDB API Error:", error);
    return null;
  }
}


/* =========================
   FORMAT TMDB DATA
========================= */

function formatTMDBItem(item, type = null) {
  const mediaType =
    type ||
    item.media_type ||
    (item.title ? "movie" : "tv");

  const title =
    mediaType === "movie"
      ? item.title
      : item.name;

  const releaseDate =
    mediaType === "movie"
      ? item.release_date
      : item.first_air_date;

  const year =
    releaseDate
      ? releaseDate.substring(0, 4)
      : "N/A";

  return {
    id: item.id,
    title: title || "Untitled",
    type: mediaType,
    year: year,

    rating:
      typeof item.vote_average === "number"
        ? item.vote_average.toFixed(1)
        : "N/A",

    genre: "",
    genres: [],

    runtime: "",
    director: "",

    releaseDate:
      releaseDate || "Not available",

    description:
      item.overview ||
      "No description available.",

    poster:
      item.poster_path
        ? `${TMDB_IMAGE_URL}${item.poster_path}`
        : "",

    backdrop:
      item.backdrop_path
        ? `${TMDB_BACKDROP_URL}${item.backdrop_path}`
        : "",

    addedAt: Date.now()
  };
}


/* =========================
   LOAD TRENDING MOVIES
========================= */

async function loadTrending() {
  const data = await fetchFromTMDB(
    "/trending/movie/week?language=en-US"
  );

  if (!data || !data.results) {
    return;
  }

  trendingMovies = data.results
    .slice(0, 10)
    .map(item =>
      formatTMDBItem(item, "movie")
    );

  renderMovieGrid(
    trendingMovies,
    trendingGrid
  );

  updateAllTitles();

  if (trendingMovies.length > 0) {
    setHero(trendingMovies[0]);
  }
}


/* =========================
   LOAD POPULAR TV SHOWS
========================= */

async function loadPopularTV() {
  const data = await fetchFromTMDB(
    "/tv/popular?language=en-US&page=1"
  );

  if (!data || !data.results) {
    return;
  }

  popularTVShows = data.results
    .slice(0, 10)
    .map(item =>
      formatTMDBItem(item, "tv")
    );

  renderMovieGrid(
    popularTVShows,
    tvGrid
  );

  updateAllTitles();
}


function updateAllTitles() {
  allTitles = [
    ...trendingMovies,
    ...popularTVShows
  ];
}


/* =========================
   HERO
========================= */

function setHero(item) {
  if (!item) return;

  selectedTitle = item;

  heroTitle.textContent =
    item.title;

  heroDescription.textContent =
    item.description;

  heroRating.textContent =
    `${item.rating}/10`;

  heroYear.textContent =
    item.year;

  heroGenre.textContent =
    item.type === "tv"
      ? "TV Show"
      : "Movie";

  heroImage.src =
    item.backdrop || "";

  updateHeroButton();
}


function updateHeroButton() {
  if (!selectedTitle) return;

  const heroSaved =
    watchlist.some(
      item =>
        item.id === selectedTitle.id &&
        item.type === selectedTitle.type
    );

  heroWatchlistBtn.innerHTML =
    heroSaved
      ? "✓ In Watchlist"
      : "<span>+</span> Add to Watchlist";
}


/* =========================
   CREATE MOVIE CARD
========================= */

function createMovieCard(
  item,
  watchlistMode = false
) {
  const card =
    document.createElement("article");

  card.className =
    "movie-card";

  const isSaved =
    watchlist.some(
      savedItem =>
        savedItem.id === item.id &&
        savedItem.type === item.type
    );

  let actions = "";

  if (watchlistMode) {
    if (
      activeWatchlistTab ===
      "wantToWatch"
    ) {
      actions = `
        <div class="watchlist-card-actions">
          <button
            class="complete-card-btn"
            data-complete-id="${item.id}"
            data-complete-type="${item.type}"
          >
            Mark Complete
          </button>

          <button
            data-remove-id="${item.id}"
            data-remove-type="${item.type}"
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
            data-move-back-type="${item.type}"
          >
            Watch Again
          </button>

          <button
            data-remove-completed-id="${item.id}"
            data-remove-completed-type="${item.type}"
          >
            Remove
          </button>
        </div>
      `;
    }
  }

  card.innerHTML = `
    <div
      class="poster-wrap"
      data-details-id="${item.id}"
      data-details-type="${item.type}"
    >

      ${
        item.poster
          ? `
            <img
              src="${item.poster}"
              alt="${item.title}"
            >
          `
          : `
            <div class="poster-placeholder"></div>
          `
      }

      ${
        !watchlistMode
          ? `
            <button
              class="card-save ${isSaved ? "saved" : ""}"
              data-save-id="${item.id}"
              data-save-type="${item.type}"
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


/* =========================
   RENDER MOVIE GRID
========================= */

function renderMovieGrid(
  items,
  container
) {
  if (!container) return;

  container.innerHTML = "";

  items.forEach(item => {
    container.appendChild(
      createMovieCard(item)
    );
  });
}


/* =========================
   FIND TITLE
========================= */

function findTitleById(
  id,
  type = null
) {
  const numberId =
    Number(id);

  const allAvailableTitles = [
    ...allTitles,
    ...watchlist,
    ...completed
  ];

  return allAvailableTitles.find(
    item =>
      item.id === numberId &&
      (!type || item.type === type)
  );
}


/* =========================
   LOCAL STORAGE
========================= */

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


/* =========================
   ADD TO WATCHLIST
========================= */

function addToWatchlist(item) {
  if (!item) return;

  const alreadySaved =
    watchlist.some(
      title =>
        title.id === item.id &&
        title.type === item.type
    );

  if (alreadySaved) {
    watchlist =
      watchlist.filter(
        title =>
          !(
            title.id === item.id &&
            title.type === item.type
          )
      );
  } else {
    watchlist.push({
      ...item,
      addedAt: Date.now()
    });

    completed =
      completed.filter(
        title =>
          !(
            title.id === item.id &&
            title.type === item.type
          )
      );
  }

  saveLists();
  refreshUI();
}


/* =========================
   MARK COMPLETED
========================= */

function markCompleted(item) {
  if (!item) return;

  watchlist =
    watchlist.filter(
      title =>
        !(
          title.id === item.id &&
          title.type === item.type
        )
    );

  const alreadyCompleted =
    completed.some(
      title =>
        title.id === item.id &&
        title.type === item.type
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


/* =========================
   WATCH AGAIN
========================= */

function moveBackToWatchlist(item) {
  if (!item) return;

  completed =
    completed.filter(
      title =>
        !(
          title.id === item.id &&
          title.type === item.type
        )
    );

  const alreadySaved =
    watchlist.some(
      title =>
        title.id === item.id &&
        title.type === item.type
    );

  if (!alreadySaved) {
    watchlist.push({
      ...item,
      addedAt: Date.now()
    });
  }

  saveLists();
  refreshUI();
}


/* =========================
   REMOVE COMPLETED
========================= */

function removeFromCompleted(
  id,
  type
) {
  completed =
    completed.filter(
      title =>
        !(
          title.id === Number(id) &&
          title.type === type
        )
    );

  saveLists();
  refreshUI();
}


/* =========================
   RENDER WATCHLIST
========================= */

function renderWatchlist() {
  let titles =
    activeWatchlistTab ===
    "wantToWatch"
      ? [...watchlist]
      : [...completed];

  const selectedType =
    typeFilter.value;

  if (selectedType !== "all") {
    titles =
      titles.filter(
        item =>
          item.type ===
          selectedType
      );
  }

  const selectedSort =
    sortFilter.value;

  if (
    selectedSort ===
    "rating"
  ) {
    titles.sort(
      (a, b) =>
        Number(b.rating) -
        Number(a.rating)
    );
  }

  if (
    selectedSort ===
    "title"
  ) {
    titles.sort(
      (a, b) =>
        a.title.localeCompare(
          b.title
        )
    );
  }

  if (
    selectedSort ===
    "recent"
  ) {
    titles.sort(
      (a, b) =>
        (b.addedAt || 0) -
        (a.addedAt || 0)
    );
  }

  watchlistGrid.innerHTML = "";

  if (!titles.length) {
    watchlistEmpty.classList.remove(
      "hidden"
    );

    watchlistGrid.classList.add(
      "hidden"
    );
  } else {
    watchlistEmpty.classList.add(
      "hidden"
    );

    watchlistGrid.classList.remove(
      "hidden"
    );

    titles.forEach(item => {
      watchlistGrid.appendChild(
        createMovieCard(
          item,
          true
        )
      );
    });
  }

  wantCount.textContent =
    watchlist.length;

  completedCount.textContent =
    completed.length;
}


/* =========================
   FORMAT RUNTIME
========================= */

function formatRuntime(minutes) {
  if (!minutes) return "";

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (!hours) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}


/* =========================
   GET FULL DETAILS
========================= */

async function getFullDetails(item) {
  if (!item) return null;

  const endpoint =
    item.type === "tv"
      ? `/tv/${item.id}?language=en-US&append_to_response=credits`
      : `/movie/${item.id}?language=en-US&append_to_response=credits`;

  const data =
    await fetchFromTMDB(
      endpoint
    );

  if (!data) {
    return item;
  }

  let director =
    "Not available";

  if (item.type === "movie") {
    const directorData =
      data.credits?.crew?.find(
        person =>
          person.job ===
          "Director"
      );

    if (directorData) {
      director =
        directorData.name;
    }
  } else {
    if (
      data.created_by &&
      data.created_by.length
    ) {
      director =
        data.created_by
          .map(
            person =>
              person.name
          )
          .join(", ");
    }
  }

  let runtime = "";

  if (item.type === "movie") {
    runtime =
      formatRuntime(
        data.runtime
      );
  } else {
    if (
      data.number_of_episodes
    ) {
      runtime =
        `${data.number_of_episodes} Episodes`;
    }
  }

  const releaseDate =
    data.release_date ||
    data.first_air_date ||
    item.releaseDate;

  const year =
    releaseDate
      ? releaseDate.substring(
          0,
          4
        )
      : item.year;

  return {
    ...item,

    title:
      data.title ||
      data.name ||
      item.title,

    year,

    rating:
      typeof data.vote_average ===
      "number"
        ? data.vote_average.toFixed(
            1
          )
        : item.rating,

    description:
      data.overview ||
      item.description,

    runtime,

    director,

    genres:
      data.genres
        ? data.genres.map(
            genre =>
              genre.name
          )
        : [],

    genre:
      data.genres?.[0]?.name ||
      item.genre ||
      "",

    releaseDate:
      releaseDate ||
      "Not available",

    poster:
      data.poster_path
        ? `${TMDB_IMAGE_URL}${data.poster_path}`
        : item.poster,

    backdrop:
      data.backdrop_path
        ? `${TMDB_BACKDROP_URL}${data.backdrop_path}`
        : item.backdrop
  };
}


/* =========================
   OPEN DETAILS MODAL
========================= */

async function openDetails(item) {
  if (!item) return;

  selectedTitle =
    await getFullDetails(item);

  if (!selectedTitle) return;

  modalTitle.textContent =
    selectedTitle.title;

  modalRating.textContent =
    selectedTitle.rating;

  modalYear.textContent =
    selectedTitle.year;

  modalRuntime.textContent =
    selectedTitle.runtime ||
    "";

  modalDescription.textContent =
    selectedTitle.description ||
    "No description available.";

  modalDirector.textContent =
    selectedTitle.director ||
    "Not available";

  modalReleaseDate.textContent =
    selectedTitle.releaseDate ||
    "Not available";

  modalType.textContent =
    selectedTitle.type === "tv"
      ? "TV SHOW"
      : "MOVIE";

  modalPoster.src =
    selectedTitle.poster ||
    "";

  modalBackdrop.src =
    selectedTitle.backdrop ||
    "";

  modalPoster.alt =
    selectedTitle.title;

  modalBackdrop.alt =
    selectedTitle.title;

  modalGenres.innerHTML = "";

  if (
    selectedTitle.genres &&
    selectedTitle.genres.length
  ) {
    selectedTitle.genres.forEach(
      genre => {
        const span =
          document.createElement(
            "span"
          );

        span.textContent =
          genre;

        modalGenres.appendChild(
          span
        );
      }
    );
  }

  updateModalButtons();

  detailsModal.classList.add(
    "active"
  );

  document.body.classList.add(
    "modal-open"
  );
}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {
  detailsModal.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================
   UPDATE MODAL BUTTONS
========================= */

function updateModalButtons() {
  if (!selectedTitle) return;

  const inWatchlist =
    watchlist.some(
      item =>
        item.id ===
          selectedTitle.id &&
        item.type ===
          selectedTitle.type
    );

  const isCompleted =
    completed.some(
      item =>
        item.id ===
          selectedTitle.id &&
        item.type ===
          selectedTitle.type
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


/* =========================
   SEARCH TMDB
========================= */

async function handleSearch() {
  const query =
    searchInput.value.trim();

  if (!query) {
    clearSearch();
    return;
  }

  const data =
    await fetchFromTMDB(
      `/search/multi?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`
    );

  searchResultsSection.classList.remove(
    "hidden"
  );

  trendingSection.classList.add(
    "hidden"
  );

  if (
    !data ||
    !data.results
  ) {
    showNoSearchResults();
    return;
  }

  const results =
    data.results
      .filter(
        item =>
          item.media_type ===
            "movie" ||
          item.media_type ===
            "tv"
      )
      .map(item =>
        formatTMDBItem(
          item,
          item.media_type
        )
      );

  searchResults.innerHTML =
    "";

  if (!results.length) {
    showNoSearchResults();
    return;
  }

  searchResults.classList.remove(
    "hidden"
  );

  searchEmptyState.classList.add(
    "hidden"
  );

  results.forEach(item => {
    searchResults.appendChild(
      createMovieCard(item)
    );
  });
}


function showNoSearchResults() {
  searchResults.innerHTML =
    "";

  searchResults.classList.add(
    "hidden"
  );

  searchEmptyState.classList.remove(
    "hidden"
  );
}


function clearSearch() {
  searchInput.value = "";

  searchResultsSection.classList.add(
    "hidden"
  );

  trendingSection.classList.remove(
    "hidden"
  );

  searchResults.innerHTML =
    "";

  searchEmptyState.classList.add(
    "hidden"
  );
}


/* =========================
   REFRESH UI
========================= */

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

  updateHeroButton();

  if (
    detailsModal.classList.contains(
      "active"
    )
  ) {
    updateModalButtons();
  }
}


/* =========================
   GENERAL CLICK EVENTS
========================= */

document.addEventListener(
  "click",
  function(event) {

    const saveButton =
      event.target.closest(
        "[data-save-id]"
      );

    if (saveButton) {
      event.stopPropagation();

      const item =
        findTitleById(
          saveButton.dataset.saveId,
          saveButton.dataset.saveType
        );

      addToWatchlist(item);

      return;
    }


    const detailsTarget =
      event.target.closest(
        "[data-details-id]"
      );

    if (detailsTarget) {
      const item =
        findTitleById(
          detailsTarget.dataset.detailsId,
          detailsTarget.dataset.detailsType
        );

      openDetails(item);

      return;
    }


    const completeButton =
      event.target.closest(
        "[data-complete-id]"
      );

    if (completeButton) {
      const item =
        findTitleById(
          completeButton.dataset.completeId,
          completeButton.dataset.completeType
        );

      markCompleted(item);

      return;
    }


    const removeButton =
      event.target.closest(
        "[data-remove-id]"
      );

    if (removeButton) {
      const id =
        Number(
          removeButton.dataset.removeId
        );

      const type =
        removeButton.dataset.removeType;

      watchlist =
        watchlist.filter(
          item =>
            !(
              item.id === id &&
              item.type === type
            )
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
      const item =
        findTitleById(
          moveBackButton.dataset.moveBackId,
          moveBackButton.dataset.moveBackType
        );

      moveBackToWatchlist(
        item
      );

      return;
    }


    const removeCompletedButton =
      event.target.closest(
        "[data-remove-completed-id]"
      );

    if (
      removeCompletedButton
    ) {
      removeFromCompleted(
        removeCompletedButton.dataset.removeCompletedId,
        removeCompletedButton.dataset.removeCompletedType
      );

      return;
    }
  }
);


/* =========================
   WATCHLIST TABS
========================= */

document
  .querySelectorAll(
    ".watchlist-tab"
  )
  .forEach(tab => {

    tab.addEventListener(
      "click",
      function() {

        document
          .querySelectorAll(
            ".watchlist-tab"
          )
          .forEach(item =>
            item.classList.remove(
              "active"
            )
          );

        this.classList.add(
          "active"
        );

        activeWatchlistTab =
          this.dataset.tab;

        renderWatchlist();
      }
    );
  });


/* =========================
   COMPLETED NAVIGATION
========================= */

document
  .querySelectorAll(
    "[data-open-completed]"
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      function() {

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


/* =========================
   FILTERS
========================= */

typeFilter.addEventListener(
  "change",
  renderWatchlist
);

sortFilter.addEventListener(
  "change",
  renderWatchlist
);


/* =========================
   MODAL EVENTS
========================= */

modalClose.addEventListener(
  "click",
  closeModal
);

detailsModal.addEventListener(
  "click",
  function(event) {

    if (
      event.target ===
      detailsModal
    ) {
      closeModal();
    }
  }
);

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key ===
      "Escape"
    ) {
      closeModal();
    }
  }
);


modalWatchlistBtn.addEventListener(
  "click",
  function() {

    if (!selectedTitle) {
      return;
    }

    addToWatchlist(
      selectedTitle
    );
  }
);


modalCompleteBtn.addEventListener(
  "click",
  function() {

    if (!selectedTitle) {
      return;
    }

    const alreadyCompleted =
      completed.some(
        item =>
          item.id ===
            selectedTitle.id &&
          item.type ===
            selectedTitle.type
      );

    if (alreadyCompleted) {
      return;
    }

    markCompleted(
      selectedTitle
    );
  }
);


/* =========================
   HERO EVENTS
========================= */

heroDetailsBtn.addEventListener(
  "click",
  function() {

    if (!selectedTitle) {
      return;
    }

    openDetails(
      selectedTitle
    );
  }
);


heroWatchlistBtn.addEventListener(
  "click",
  function() {

    if (!selectedTitle) {
      return;
    }

    addToWatchlist(
      selectedTitle
    );
  }
);


/* =========================
   SEARCH EVENTS
========================= */

searchInput.addEventListener(
  "input",
  function() {

    clearTimeout(
      searchTimeout
    );

    searchTimeout =
      setTimeout(
        handleSearch,
        500
      );
  }
);


clearSearchBtn.addEventListener(
  "click",
  clearSearch
);


/* =========================
   MOBILE MENU
========================= */

mobileMenuBtn.addEventListener(
  "click",
  function() {

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
      function() {

        mobileMenu.classList.remove(
          "active"
        );
      }
    );
  });


/* =========================
   INITIALISE APP
========================= */

async function initialiseApp() {
  renderWatchlist();

  await Promise.all([
    loadTrending(),
    loadPopularTV()
  ]);

  refreshUI();
}


initialiseApp();
