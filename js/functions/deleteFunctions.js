import { state } from '../data.js';
import * as config from '../config.js';

export function clearMarker(curEl) {
  state.storage.markers.forEach(marker => {
    if (
      curEl.coords[0] === marker.marker._latlng.lat &&
      curEl.coords[1] === marker.marker._latlng.lng
    ) {
      const index = state.storage.markers.indexOf(marker);
      state.mapping.map.removeLayer(marker.marker);
      state.storage.markers.splice(index, 1);
    }
  });
}

export function deleteWorkout() {
  const delBtn = document.querySelector('.remove--btn');
  delBtn.addEventListener('click', e => {
    const workout = e.target.parentElement;
    const curEl = state.storage.workouts.find(
      work => work.id === workout.dataset.id
    );

    clearMarker(curEl);
    const index = state.storage.workouts.indexOf(curEl);
    state.storage.workouts.splice(index, 1);
    config.containerWorkouts.removeChild(workout);

    let workouts = JSON.parse(localStorage.getItem('workouts'));
    workouts = state.storage.workouts;
    localStorage.setItem('workouts', JSON.stringify(workouts));
  });
}

export function deleteAllWorkouts() {
  state.storage.markers.forEach(marker => {
    state.mapping.map.removeLayer(marker.marker);
  });
  const workoutDivs = document.querySelectorAll('.workout');
  workoutDivs.forEach(workout => {
    config.containerWorkouts.removeChild(workout);
  });
  state.storage.workouts.length = 0;
  localStorage.removeItem('workouts');
}
