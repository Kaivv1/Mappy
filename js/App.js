'use strict';
import * as config from './config.js';
import { getPosition, viewAllMarkers } from './functions/mapFunctions.js';
import { getLocalStorage } from './functions/localStorageFunctions.js';
import { newWorkout } from './functions/workoutFunctions.js';
import { toggleElevationField } from './functions/viewFunctions.js';
import { moveToPopup } from './functions/mapFunctions.js';
import { deleteAllWorkouts } from './functions/deleteFunctions.js';
import { sort } from './functions/renderFunctions.js';
function initApp() {
  getPosition();
  getLocalStorage();
  config.form.addEventListener('submit', newWorkout.bind(this));
  config.inputType.addEventListener('change', toggleElevationField);
  config.containerWorkouts.addEventListener('click', moveToPopup.bind(this));
  config.delAllWorkouts.addEventListener('click', deleteAllWorkouts);
  config.viewAllMarkers.addEventListener('click', viewAllMarkers);
  config.sortForm.addEventListener('submit', sort.bind(this));
}

initApp();
