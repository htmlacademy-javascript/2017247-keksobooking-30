const DEFAULT_VALUE = 'any';

const FILTER_PRICE_OPTIONS = {
  'any': {
    min: 0,
    max: 100000
  },
  'middle': {
    min: 10000,
    max: 50000
  },
  'low': {
    min: 0,
    max: 10000
  },
  'high': {
    min: 50000,
    max: 100000
  }
};

const MAX_NUMBER_OF_ADS = 10;

const mapFiltersContainer = document.querySelector('.map__filters-container');
const mapFiltersElement = mapFiltersContainer.querySelector('.map__filters');
const mapFilterType = mapFiltersElement.querySelector('#housing-type');
const mapFilterPrice = mapFiltersElement.querySelector('#housing-price');
const mapFilterRooms = mapFiltersElement.querySelector('#housing-rooms');
const mapFilterGuests = mapFiltersElement.querySelector('#housing-guests');

// Условия для фильтров
const filterSimilarAds = (similarAds, featuresList) => similarAds
  .filter(({ offer }) => (mapFilterType.value === DEFAULT_VALUE || offer.type === mapFilterType.value))
  .filter(({ offer }) => (offer.price >= FILTER_PRICE_OPTIONS[mapFilterPrice.value].min && offer.price <= FILTER_PRICE_OPTIONS[mapFilterPrice.value].max))
  .filter(({ offer }) => (mapFilterRooms.value === DEFAULT_VALUE || offer.rooms === Number(mapFilterRooms.value)))
  .filter(({ offer }) => (mapFilterGuests.value === DEFAULT_VALUE || offer.guests === Number(mapFilterGuests.value)))
  .filter(({ offer }) => (
    featuresList.length === 0 || (offer.features && featuresList.every(
      (feature) => offer.features.includes(feature))
    ))
  )
  .slice(0, MAX_NUMBER_OF_ADS);

export { filterSimilarAds };
