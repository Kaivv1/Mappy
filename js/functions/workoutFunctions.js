import { state } from '../data.js';
import * as config from '../config.js';
import { allPositive, validInputs } from '../helper.js';
import { renderWorkoutMarker, renderWorkout } from './renderFunctions.js';
import { hideForm } from './viewFunctions.js';
import { setLocalStorage } from './localStorageFunctions.js';
import { Running } from '../views/runningView.js';
import { Cycling } from '../views/cyclingView.js';

export function newWorkout(e) {
  e.preventDefault();

  const type = config.inputType.value;
  const distance = +config.inputDistance.value;
  const duration = +config.inputDuration.value;
  const { lat, lng } = state.mapping.mapEvent.latlng;
  let workout;

  if (type === 'running') {
    const cadence = +config.inputCadence.value;
    if (
      !validInputs(distance, duration, cadence) ||
      !allPositive(distance, duration, cadence)
    )
      return alert('Inputs have to be positive numbers or filled!');

    workout = new Running([lat, lng], distance, duration, cadence);
  }

  if (type === 'cycling') {
    const elevation = +config.inputElevation.value;
    if (
      !validInputs(distance, duration, elevation) ||
      !allPositive(distance, duration)
    )
      return alert('Inputs have to be positive numbers or filled!');

    workout = new Cycling([lat, lng], distance, duration, elevation);
  }

  state.storage.workouts.push(workout);

  renderWorkoutMarker(workout);
  renderWorkout(workout);
  hideForm();
  setLocalStorage();
}
