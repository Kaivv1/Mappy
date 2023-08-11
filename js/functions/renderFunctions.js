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
      <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value value__distance">${workout.distance}</span>
        <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value value__duration">${workout.duration}</span>
        <span class="workout__unit">min</span>
        </div>
        `;

  if (workout.type === 'running')
    html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value value__pace">${Number.parseFloat(
        workout.pace
      ).toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value value__cadence">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
        </div>
        <button class="done act-btn hidden">Done</button>
        </li>
        `;

  if (workout.type === 'cycling')
    html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value value__speed">${Number.parseFloat(
        workout.speed
      ).toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value value__elevation">${
          workout.elevationGain
        }</span>
        <span class="workout__unit">m</span>
      </div>
      <button class="done act-btn hidden">Done</button>
      </li>
      `;

  config.form.insertAdjacentHTML('afterend', html);

  // Edit workout
  edit();

  deleteWorkout();
}

export function renderWorkoutMarker(workout) {
  const marker = new L.marker(workout.coords)
    .bindPopup(
      L.popup({
        maxWidth: 250,
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
  console.log(marker);
}
