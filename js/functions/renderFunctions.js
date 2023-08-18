import { edit } from './editFunction.js';
import { deleteWorkout } from './deleteFunctions.js';
import { state } from '../data.js';
import * as config from '../config.js';

export function renderWorkout(workout) {
  let html = `
  <li class="workout workout--${workout.type}" data-id="${workout.id}">
  <h2 class="workout__title">${workout.description}</h2>
  <button class="remove--btn workout--btn">&#10005;</button>
      <button class="edit--btn workout--btn">Edit</button>
      <div class ="workout__details--container">
      <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value workout__value-change value__distance">${
        workout.distance
      }</span>
        <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value workout__value-change value__duration">${
          workout.duration
        }</span>
        <span class="workout__unit">min</span>
        </div>
        `;

  if (workout.type === 'running')
    html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value  value__pace">${Number.parseFloat(
        workout.pace
      ).toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value workout__value-change value__cadence">${Number.parseFloat(
          workout.cadence
        ).toFixed(0)}</span>
        <span class="workout__unit">spm</span>
        </div>
        </div>
        <div>
        <button class="done act-btn hidden">Done</button>
        </div>
        </li>
        `;

  if (workout.type === 'cycling')
    html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value  value__speed">${Number.parseFloat(
        workout.speed
      ).toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value workout__value-change value__elevation" minlength="0" maxlength="5">${Number.parseFloat(
          workout.elevationGain
        ).toFixed(0)}</span>
        <span class="workout__unit">m</span>
      </div>
      </div>
      <div>
      <button class="done act-btn hidden">Done</button>
      </div>
      </li>
      `;

  config.form.insertAdjacentHTML('afterend', html);

  // Edit workout
  edit();

  // Delete workout
  deleteWorkout();
}

export function renderWorkoutMarker(workout) {
  const marker = new L.marker(workout.coords)
    .bindPopup(
      L.popup({
        maxWidth: 260,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      })
    )
    .setPopupContent(
      `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
    );

  state.mapping.map.addLayer(marker);
  marker.openPopup();

  state.storage.markers.push({ marker });
}

function sortWorkouts(property) {
  if (property === 'none') {
    state.storage.workouts = JSON.parse(localStorage.getItem('workouts'));
  } else {
    const compareFn = (a, b) => {
      const aValue = parseFloat(a[property]);
      const bValue = parseFloat(b[property]);

      return aValue - bValue;
    };
    state.storage.workouts.sort(compareFn);
  }
  renderWorkoutList();
}

function renderWorkoutList() {
  const workoutDivs = document.querySelectorAll('.workout');
  workoutDivs.forEach(workout => {
    config.containerWorkouts.removeChild(workout);
  });

  for (const workout of state.storage.workouts) {
    renderWorkout(workout);
  }
}

export function sort(e) {
  e.preventDefault();
  const type = config.inputSort.value;

  sortWorkouts(type);
}
