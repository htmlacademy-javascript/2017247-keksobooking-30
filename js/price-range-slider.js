import { Price, onPriceChange } from './form.js';

const MIN_PRICE = {
  flat: 1000,
  bungalow: 0,
  house: 5000,
  palace: 10000,
  hotel: 3000
};

const STEP = 1;

const sliderElement = document.querySelector('.ad-form__slider');
const formElement = document.querySelector('.ad-form');
const priceElement = formElement.querySelector('#price');
const typeElement = formElement.querySelector('#type');

let valueCount = MIN_PRICE[typeElement.value];

const onSliderUpdate = () => {
  priceElement.value = sliderElement.noUiSlider.get();
  priceElement.placeholder = MIN_PRICE[typeElement.value];
  onPriceChange();
};

const createSlider = () => {
  noUiSlider.create(sliderElement, {
    range: {
      min: valueCount,
      max: Price.MAX
    },
    step: STEP,
    start: valueCount,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  sliderElement.noUiSlider.on('slide', onSliderUpdate);
};

const updateSlider = (number) => {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: number,
      max: Price.MAX
    },
    start: number,
    step: STEP,
    connect: 'lower'
  });
};

const onInputPriceChange = () => {
  sliderElement.noUiSlider.set([priceElement.value, null]);
};

const onSelectTypeChange = () => {
  valueCount = MIN_PRICE[typeElement.value];
  updateSlider(valueCount);
};

const resetSlider = () => {
  updateSlider(MIN_PRICE[typeElement.value]);
};

const updateSliderOptions = () => {
  typeElement.addEventListener('change', onSelectTypeChange);
  priceElement.addEventListener('change', onInputPriceChange);
};

export { createSlider, updateSliderOptions, resetSlider };
