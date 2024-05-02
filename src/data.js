import axios from 'axios';
export const perPage = 40;
const apiKey = 'live_HdoCjTnFdLHiC3kvnww3rwGzRt9wyyf4AAamqdllHtH8LE8QUY1z4NNsB5Y50Zde';

export const getPhotos = async (searchQuery, page) => {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  return await axios.get(`${url}`).then((info) => {
    return info.data;
  });
};

export const makeSinglePhotoHTML = (photo) => {
  return `
    <a class="photo-card" href=${photo.largeImageURL}><img class="image" src="${photo.webformatURL}" alt="${photo.tags}" title="tags: ${photo.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b>${photo.views}
      </p>
      <p class="info-item">
        <b>Comments</b>${photo.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${photo.downloads}
      </p>
    </div></a>`;
};