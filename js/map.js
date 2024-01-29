import { activateFormElement, onAddressChange } from './form.js';
import { createAdCard } from './card.js';
import { bootstrap } from './data.js';
import { filterSimilarAds } from './filters.js';
import { debounce } from './utils.js';

// Задержка отрисовки фильтров
const RERENDER_DELAY = 500;

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 10;

const CITY_CENTER = {
  lat: 35.701384,
  lng: 139.715669
};

const startCoordinate = {
  lat: 35.681729,
  lng: 139.753927
};

const mainIconConfig = {
  url: '/img/main-pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52
};

const iconConfig = {
  url: '/img/pin.svg',
  width: 40,
  height: 40,
  anchorX: 20,
  anchorY: 40
};

const mapElement = document.querySelector('#map-canvas');
const mapFiltersElement = document.querySelector('.map__filters');
const formElement = document.querySelector('.ad-form');
const addressElement = formElement.querySelector('#address');

// Создание карты
const map = L.map(mapElement);

// Пустая переменная для массива с данными
let dataSimilarAds = [];

// Переменные для отрисовки маркеров
let markersList = Array.from(mapFiltersElement.querySelectorAll('.map__checkbox:checked'), (element) => element.value);
let currentsMarkers;

// Создание иконки для главной метки (маркера)
const mainPinIcon = L.icon({
  iconUrl: mainIconConfig.url,
  iconSize: [mainIconConfig.width, mainIconConfig.height],
  iconAnchor: [mainIconConfig.anchorX, mainIconConfig.anchorY]
});

// Создание иконки для обычной метки (маркера)
const pinIcon = L.icon({
  iconUrl: iconConfig.url,
  iconSize: [iconConfig.width, iconConfig.height],
  iconAnchor: [iconConfig.anchorX, iconConfig.anchorY]
});

// Создание передвигающейся главной метки (маркера) и добавление её на карту
const mainPinMarker = L.marker(CITY_CENTER, {
  draggable: true,
  icon: mainPinIcon
});

mainPinMarker.addTo(map);

// Поле адреса заполнено по умолчанию (используются координаты центра Токио)
addressElement.value = `${CITY_CENTER.lat.toFixed(5)}, ${CITY_CENTER.lng.toFixed(5)}`;

// Выбор адреса на карте, путём перемещения главной метки (маркера) и запись данных координат в поле адрес
const onMainPinMarkerMoveend = () => {
  mainPinMarker.on('moveend', (evt) => {
    const coordinates = evt.target.getLatLng();
    addressElement.value = `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`;
    onAddressChange();
  });
};

// Создание отдельного слоя на карте, куда будут добавляться наши метки
const markerGroup = L.layerGroup().addTo(map);

// Создание маркера и добавление его на слой
const createMarker = (similarAd) => {
  const { location } = similarAd;
  const marker = L.marker(
    location,
    {
      icon: pinIcon,
    }
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createAdCard(similarAd));
};

// Действия при изменении фильтров
const onFiltersChange = debounce(() => {
  markerGroup.clearLayers();
  markersList = Array.from(mapFiltersElement.querySelectorAll('.map__checkbox:checked'), (element) => element.value);
  filterSimilarAds(currentsMarkers, markersList).forEach((data) => createMarker(data));
}, RERENDER_DELAY);

// Отрисовывает маркеры по массиву (фильтрованному)
const createMarkers = (similarAds) => {
  currentsMarkers = similarAds;
  filterSimilarAds(currentsMarkers, markersList).forEach((point) => createMarker(point));
};

// Отрисовывает маркеры по массиву
const renderMarkers = (similarAds) => {
  dataSimilarAds = similarAds;
  createMarkers(dataSimilarAds);
  mapFiltersElement.addEventListener('change', () => onFiltersChange());
};

// Функция, инициализирующая карту и активирующая форму
const initializeMap = () => {
  map.on('load', () => {
    activateFormElement();
    bootstrap();
  })
    // Задаем параметры отображения карты (центр и масштаб)
    .setView(startCoordinate, ZOOM);

  // Создаем слой с изображением карты и добавляем его на карту
  L.tileLayer(TILE_LAYER, {
    attribution: COPYRIGHT
  }).addTo(map);
};

// Функция, возвращающая к начальным значениям метки, масштаба и центра карты
const resetMap = () => {
  map.closePopup();
  mainPinMarker.setLatLng(startCoordinate);
  map.setView(startCoordinate, ZOOM);
  addressElement.value = `${CITY_CENTER.lat.toFixed(5)}, ${CITY_CENTER.lng.toFixed(5)}`;
  mapFiltersElement.reset();

  if (dataSimilarAds.length !== 0) {
    markerGroup.clearLayers();
    createMarkers(dataSimilarAds);
    mapFiltersElement.reset();
  }
};

export { initializeMap, CITY_CENTER, mainPinMarker, onMainPinMarkerMoveend, renderMarkers, resetMap };
