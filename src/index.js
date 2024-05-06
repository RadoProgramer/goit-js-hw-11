import SimpleLightbox from "simplelightbox";
import axios from "axios";
import Notiflix from "notiflix";
import "simplelightbox/dist/simple-lightbox.min.css";


document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let currentPage = 1;
  let currentQuery = '';

  searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    currentPage = 1;
    gallery.innerHTML = '';
    const searchQuery = event.target.elements.searchQuery.value.trim();
    if (!searchQuery) {
      return;
    }
    currentQuery = searchQuery;
    await searchImages(searchQuery);
  });

  loadMoreBtn.addEventListener('click', async function () {
    currentPage += 1;
    await searchImages(currentQuery);
  });

  async function searchImages(query) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '43741180-a06ec88db85c6b0bd4566abf3',
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: currentPage,
          per_page: 40
        }
      });
      const { hits, totalHits } = response.data;
      if (hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      renderImages(hits);
      if (hits.length < 40) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreBtn.style.display = 'block';
      }
      SimpleLightbox.refresh();
      scrollToGallery();
    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
    }
  }

  function renderImages(images) {
    const galleryHTML = images.map(image => `
      <div class="photo-card">
        <a href="${image.largeImageURL}" data-lightbox="gallery">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `).join('');
    gallery.insertAdjacentHTML('beforeend', galleryHTML);
  }

  function scrollToGallery() {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth'
    });
  }
});