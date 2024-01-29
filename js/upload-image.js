const photoOptions = {
  alt: 'Фото вашего жилья',
  width: 70,
  height: 70,
  defaultSrc: 'img/muffin-grey.svg',
};

const formElement = document.querySelector('.ad-form');
const previewAvatar = formElement.querySelector('.ad-form-header__preview img');
const previewPhotoContainer = formElement.querySelector('.ad-form__photo');

// Создание миниатюры в DOM
const createThumbnailPhoto = () => {
  previewPhotoContainer.innerHTML = '';
  const previewPhoto = document.createElement('img');
  previewPhoto.alt = photoOptions.alt;
  previewPhoto.width = photoOptions.width;
  previewPhoto.height = photoOptions.height;
  previewPhotoContainer.appendChild(previewPhoto);
  return previewPhoto;
};

// Отрисовка миниатюры фото
const renderThumbnail = (file, preview) => {
  if (file?.type.startsWith('image')) {
    preview.src = URL.createObjectURL(file);
  }
};

// Обнуление загруженных изображений
const resetImages = () => {
  previewPhotoContainer.innerHTML = '';
  previewAvatar.src = photoOptions.defaultSrc;
};

export { createThumbnailPhoto, renderThumbnail, resetImages };
