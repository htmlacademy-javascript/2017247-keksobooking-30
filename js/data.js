import { loadData } from './api.js';
import { showDataErrorMessage } from './status-message.js';
import { renderMarkers } from './map.js';
import { activateMapFiltersElement } from './form.js';

// Загрузка данных
const bootstrap = async () => {
  try {
    const similarAds = await loadData();
    renderMarkers(similarAds);
    activateMapFiltersElement();
  } catch (error) {
    showDataErrorMessage();
  }
};

export { bootstrap };
