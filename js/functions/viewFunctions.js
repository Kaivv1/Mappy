import { state } from '../data.js';
import * as config from '../config.js';

export function showForm(mapE) {
  state.mapping.mapEvent = mapE;
  config.form.classList.remove('hidden');
  config.inputDistance.focus();
}

export function hideForm() {
  config.inputDistance.value =
    config.inputDuration.value =
    config.inputCadence.value =
    config.inputElevation.value =
      '';

  config.form.style.display = 'none';
  config.form.classList.add('hidden');
  setTimeout(() => (config.form.style.display = 'grid'), 1000);
}

export function toggleElevationField() {
  config.inputElevation
    .closest('.form__row')
    .classList.toggle('form__row--hidden');
  config.inputCadence
    .closest('.form__row')
    .classList.toggle('form__row--hidden');
}
