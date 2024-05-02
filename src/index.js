// Importowanie potrzebnych modułów

import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";




// Obsługa przycisku "Search"
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = searchForm.searchQuery.value.trim();
  if (searchQuery === '') return;
  
  await searchImages(searchQuery);
});

// Obsługa przycisku "Load more"
loadMoreBtn.addEventListener('click', async () => {
  const searchQuery = searchForm.searchQuery.value.trim();
  if (searchQuery === '') return;
  
  await searchImages(searchQuery, page++);
});

// Początkowa wartość strony
let page = 1;