const SERVER_URL = 'https://30.javascript.htmlacademy.pro/keksobooking';

const ServerRoute = {
  GET_DATA: '/data',
  SEND_DATA: '/'
};

const HttpMethod = {
  GET: 'GET',
  POST: 'POST'
};

const ErrorText = {
  [HttpMethod.GET]: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  [HttpMethod.POST]: 'Не удалось отправить форму. Попробуйте ещё раз'
};

// Общая функция для всех видов запросов
const request = async (url, method = HttpMethod.GET, body = null) => {
  const response = await fetch(url, { method, body });
  if (!response.ok) {
    throw new Error(ErrorText[method]);
  }

  return response.json();
};

// Получение данных
const loadData = async () => request(SERVER_URL + ServerRoute.GET_DATA);

// Отправка данных
const sendData = async (data) => request(SERVER_URL + ServerRoute.SEND_DATA, HttpMethod.POST, data);

export { loadData, sendData };

