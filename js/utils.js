// Функция для проверки, нажата ли клавиша "Escape"
const isEscapeKey = (evt) => evt.key === 'Escape';

// Устранение дребезга
const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { isEscapeKey, debounce };
