const typesHousing = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель'
};

const adCardTemplate = document.querySelector('#card').content.querySelector('.popup');

const generateFeauteres = (offerFeatures) => {
  const featuresList = document.createElement('ul');
  featuresList.className = 'popup__features';

  if (!offerFeatures) {
    featuresList.classList.add('visually-hidden');
    return featuresList;
  }

  offerFeatures.forEach((feature) => {
    const featuresItem = document.createElement('li');
    featuresItem.className = `popup__feature popup__feature--${feature}`;
    featuresList.appendChild(featuresItem);
  });

  return featuresList;
};

const generatePhotos = (offerPhotos) => {
  const photosList = document.createElement('div');
  photosList.className = 'popup__photos';

  if (!offerPhotos) {
    photosList.classList.add('visually-hidden');
    return photosList;
  }

  offerPhotos.forEach((url) => {
    const photosItem = document.createElement('img');
    photosItem.className = 'popup__photo';
    photosItem.src = url;
    photosItem.width = 45;
    photosItem.height = 40;
    photosItem.alt = 'Фотография жилья';
    photosList.appendChild(photosItem);
  });
  return photosList;
};

// Функция для создания карточки объявления
const createAdCard = ({ author, offer }) => {
  const adCard = adCardTemplate.cloneNode(true);
  const features = generateFeauteres(offer.features);
  const photos = generatePhotos(offer.photos);

  adCard.querySelector('.popup__avatar').src = author.avatar;
  adCard.querySelector('.popup__title').textContent = offer.title;
  adCard.querySelector('.popup__text--address').textContent = offer.address;
  adCard.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  adCard.querySelector('.popup__type').textContent = typesHousing[offer.type];
  adCard.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  adCard.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  adCard.querySelector('.popup__features').replaceWith(features);

  if (offer.description) {
    adCard.querySelector('.popup__description').textContent = offer.description;
  } else {
    adCard.querySelector('.popup__description').classList.add('visually-hidden');
  }

  adCard.querySelector('.popup__photos').replaceWith(photos);

  return adCard;
};

export { createAdCard };
