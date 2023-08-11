'use strict';
import * as config from './config.js';
import { state } from './data.js';

import { getPosition } from './functions/mapFunctions.js';
import { getLocalStorage } from './functions/localStorageFunctions.js';
import { newWorkout } from './functions/workoutFunctions.js';
import { toggleElevationField } from './functions/viewFunctions.js';
import { moveToPopup } from './functions/mapFunctions.js';

function initApp() {
  getPosition();
  getLocalStorage();
  config.form.addEventListener('submit', newWorkout.bind(this));
  config.inputType.addEventListener('change', toggleElevationField);
  config.containerWorkouts.addEventListener('click', moveToPopup.bind(this));
  console.log(state.storage.markers);
  console.log(state.storage.workouts);
}

initApp();
