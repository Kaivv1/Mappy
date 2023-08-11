import { state } from '../data.js';
import { renderWorkoutMarker } from './renderFunctions.js';
import { showForm } from './viewFunctions.js';

export function getPosition() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(loadMap.bind(this)),
      function () {
        alert('Could not get your position');
      };
}
export function loadMap(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const coords = [latitude, longitude];

  state.mapping.map = L.map('map').setView(coords, state.mapping.mapZoomLevel);

  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(state.mapping.map);

  // Handling clicks on map
  state.mapping.map.on('click', showForm.bind(this));

  state.storage.workouts.forEach(work => {
    renderWorkoutMarker(work);
  });
}

export function moveToPopup(e) {
  if (!state.mapping.map) return;

  const workoutEl = e.target.closest('.workout');

  if (!workoutEl) return;

  const workout = state.storage.workouts.find(
    work => work.id === workoutEl.dataset.id
  );

  if (!workout) return;
  state.mapping.map.setView(workout.coords, state.mapping.mapZoomLevel, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
}
