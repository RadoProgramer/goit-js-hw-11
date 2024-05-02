// Importowanie potrzebnych modułów
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";

// Funkcja wyszukiwania obrazów
async function searchImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: 'YOUR_PIXABAY_API_KEY',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40 // 40 obrazków na stronę
      }
    });

    const data = response.data;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      gallery.innerHTML = ''; // wyczyszczenie galerii przy pierwszym zapytaniu
    }

    data.hits.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('photo-card');
      card.innerHTML = `
        <a href="${image.largeImageURL}" class="gallery-item"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });

    // Inicjalizacja SimpleLightbox
    const lightbox = new SimpleLightbox('.gallery-item');
    lightbox.refresh(); // Odświeżenie SimpleLightbox po dodaniu nowych obrazków

    // Pokazanie lub ukrycie przycisku "Load more"
    if (data.totalHits > page * 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
}

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