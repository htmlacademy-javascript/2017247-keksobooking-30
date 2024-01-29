import { resetMap, onMainPinMarkerMoveend } from './map.js';
import { createSlider, updateSliderOptions, resetSlider } from './price-range-slider.js';
import { CITY_CENTER, mainPinMarker } from './map.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './status-message.js';
import { createThumbnailPhoto, renderThumbnail, resetImages } from './upload-image.js';

const TitleLength = {
  MIN: 30,
  MAX: 100
};

const Price = {
  MAX: 100000,
  MIN: {
    'bungalow': 0,
    'flat': 1000,
    'hotel': 3000,
    'house': 5000,
    'palace': 10000,
  }
};

const roomOption = {
  1: ['1'],
  2: ['2', '1'],
  3: ['3', '2', '1'],
  100: ['0']
};

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'svg'];

const SubmitButtonCaption = {
  SUBMITTING: 'Отправляю...',
  IDLE: 'Опубликовать'
};

const formElement = document.querySelector('.ad-form');
const mapFiltersElement = document.querySelector('.map__filters');
const titleElement = formElement.querySelector('#title');
const addressElement = formElement.querySelector('#address');
const priceElement = formElement.querySelector('#price');
const typeElement = formElement.querySelector('#type');
const roomElement = formElement.querySelector('#room_number');
const guestElement = formElement.querySelector('#capacity');
const timeInElement = formElement.querySelector('#timein');
const timeOutElement = formElement.querySelector('#timeout');
const descriptionElement = formElement.querySelector('#description');
const featuresElements = formElement.querySelectorAll('.features__checkbox');
const avatarFieldElement = formElement.querySelector('#avatar');
const photoFieldElement = formElement.querySelector('#images');
const previewAvatar = formElement.querySelector('.ad-form-header__preview img');
const submitButtonElement = formElement.querySelector('.ad-form__submit');

// Значения формы по умолчанию
const typeElementDefault = typeElement.value;
const priceElementDefault = priceElement.value;
const pricePlaceholderDefault = priceElement.placeholder;
const roomElementDefault = roomElement.value;
const guestElementDefault = guestElement.value;
const timeInElementDefault = timeInElement.value;
const timeOutElementDefault = timeOutElement.value;

// Обнуляет удобства
const resetFeatures = () => featuresElements.forEach(
  (feature) => {
    feature.checked = false;
  }
);

const activateFormElement = () => {
  formElement.classList.remove('ad-form--disabled');
  formElement.childNodes.forEach((element) => {
    element.disabled = false;
  });
  createSlider();
  updateSliderOptions();
  onMainPinMarkerMoveend();
};

const activateMapFiltersElement = () => {
  mapFiltersElement.classList.remove('map__filters--disabled');
  mapFiltersElement.childNodes.forEach((element) => {
    element.disabled = false;
  });
};

const toggleSubmitButton = (isDisabled) => {
  submitButtonElement.disabled = isDisabled;

  if (isDisabled) {
    submitButtonElement.textContent = SubmitButtonCaption.SUBMITTING;
  } else {
    submitButtonElement.textContent = SubmitButtonCaption.IDLE;
  }
};

const pristine = new Pristine(formElement, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'error-text'
});

Pristine.setLocale('ru');
Pristine.addMessages('ru', {
  required: 'Это поле обязательно к заполнению'
});

// Проверка загруженного типа фото
const hasValidPhoto = (file) => {
  if (!file) {
    return true;
  }
  file = file.toLowerCase();
  return FILE_TYPES.some((type) => file.endsWith(type));
};

// Проверка длины заголовка
const hasValidLengthTitle = (value) => value.length >= TitleLength.MIN && value.length <= TitleLength.MAX;

// Проверка указания адресных координат
const hasValidAddress = () => addressElement.value !== `${CITY_CENTER.lat.toFixed(5)}, ${CITY_CENTER.lng.toFixed(5)}`;

// Проверка минимальной цены
const hasValidPriceMin = (value) => {
  priceElement.min = Price.MIN[typeElement.value];

  return value.length && Number(value) >= priceElement.min;
};

const getPriceMinErrorMessage = () => {
  priceElement.min = Price.MIN[typeElement.value];

  return `Цена должна быть не меньше ${priceElement.min} для данного типа жилья`;
};

// Проверка максимальной цены
const hasValidPriceMax = (value) => Number(value) <= Price.MAX;

// Проверка количества комнат и количества мест
const hasValidNumberOfSeats = () => roomOption[roomElement.value].includes(guestElement.value);

pristine.addValidator(
  avatarFieldElement,
  hasValidPhoto,
  'Неправильный формат изображения',
  1,
  true
);

pristine.addValidator(
  titleElement,
  hasValidLengthTitle,
  `Минимальная длина — ${TitleLength.MIN} символов, максимальная длина — ${TitleLength.MAX} символов`,
  1,
  true
);

pristine.addValidator(
  addressElement,
  hasValidAddress,
  'Это поле заполняется автоматически, перемещением красного маркера на карте',
  1,
  true
);

pristine.addValidator(
  priceElement,
  hasValidPriceMin,
  getPriceMinErrorMessage,
  1,
  true
);

pristine.addValidator(
  priceElement,
  hasValidPriceMax,
  `Максимальное значение — ${Price.MAX}`,
  1,
  true
);

pristine.addValidator(
  guestElement,
  hasValidNumberOfSeats,
  'Количество мест не соответствует количеству комнат',
  1,
  true
);

pristine.addValidator(
  photoFieldElement,
  hasValidPhoto,
  'Неправильный формат изображения',
  1,
  true
);

const onAvatarChange = (evt) => {
  pristine.validate(avatarFieldElement);
  renderThumbnail(evt.target.files[0], previewAvatar);
};

const onAddressChange = () => {
  pristine.validate(mainPinMarker);
};

const onPriceChange = () => {
  priceElement.placeholder = Price.MIN[typeElement.value];
  pristine.validate(priceElement);
};

const onRoomChange = () => pristine.validate(roomElement);

const onGuestChange = () => pristine.validate(guestElement);

const onCheckTimeInChange = () => {
  timeInElement.value = timeOutElement.value;
};

const onCheckOutTimeChange = () => {
  timeOutElement.value = timeInElement.value;
};

const onPhotoChange = (evt) => {
  pristine.validate(photoFieldElement);
  renderThumbnail(evt.target.files[0], createThumbnailPhoto());
};

// Очистка input после нажатия кнопки
const cleanInputs = () => {
  titleElement.value = '';
  priceElement.value = '';
  descriptionElement.value = '';
};

// Очистка формы
const resetForm = () => {
  formElement.reset();
  pristine.reset();
  resetMap();
  resetSlider();
  cleanInputs();
  resetFeatures();
  resetImages();
  typeElement.value = typeElementDefault;
  priceElement.value = priceElementDefault;
  priceElement.placeholder = pricePlaceholderDefault;
  roomElement.value = roomElementDefault;
  guestElement.value = guestElementDefault;
  timeInElement.value = timeInElementDefault;
  timeOutElement.value = timeOutElementDefault;
};

// Отправка формы
const sendForm = async () => {
  if (!pristine.validate()) {
    return;
  }

  try {
    toggleSubmitButton(true);
    await sendData(new FormData(formElement));
    toggleSubmitButton(false);
    showSuccessMessage();
    resetForm();
  } catch {
    showErrorMessage();
    toggleSubmitButton(false);
  }
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  sendForm(evt.target);
};

const onFormReset = (evt) => {
  evt.preventDefault();
  resetForm();
};

avatarFieldElement.addEventListener('change', onAvatarChange);
typeElement.addEventListener('change', onPriceChange);
roomElement.addEventListener('change', onRoomChange);
guestElement.addEventListener('change', onGuestChange);
timeInElement.addEventListener('change', onCheckOutTimeChange);
timeOutElement.addEventListener('change', onCheckTimeInChange);
photoFieldElement.addEventListener('change', onPhotoChange);
formElement.addEventListener('submit', onFormSubmit);
formElement.addEventListener('reset', onFormReset);

export { Price, activateFormElement, activateMapFiltersElement, onPriceChange, onAddressChange };

