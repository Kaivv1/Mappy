'use strict';
import * as config from './config.js';
import { state } from './data.js';

import { getPosition, viewAllMarkers } from './functions/mapFunctions.js';
import { getLocalStorage } from './functions/localStorageFunctions.js';
import { newWorkout } from './functions/workoutFunctions.js';
import { toggleElevationField } from './functions/viewFunctions.js';
import { moveToPopup } from './functions/mapFunctions.js';
import { deleteAllWorkouts } from './functions/deleteFunctions.js';
import {
  sortWorkouts,
  renderWorkoutList,
} from './functions/renderFunctions.js';
function initApp() {
  getPosition();
  getLocalStorage();
  config.form.addEventListener('submit', newWorkout.bind(this));
  config.inputType.addEventListener('change', toggleElevationField);
  config.containerWorkouts.addEventListener('click', moveToPopup.bind(this));
  config.delAllWorkouts.addEventListener('click', deleteAllWorkouts);
  config.viewAllMarkers.addEventListener('click', viewAllMarkers);
  config.sortSelector.addEventListener('change', function () {
    const selectedProperty = this.value;
    sortWorkouts(selectedProperty);
    renderWorkoutList();
  });
  console.log(state.storage.markers);
  console.log(state.storage.workouts);
}

initApp();

// // Step 3: Update event listener for sorting selector

// config.sortSelector.addEventListener('change', function () {
//   const selectedProperty = this.value;
//   sortWorkouts(selectedProperty);
//   renderWorkoutList();
// });
