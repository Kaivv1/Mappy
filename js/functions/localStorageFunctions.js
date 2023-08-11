import { state } from '../data.js';
import { renderWorkout } from './renderFunctions.js';
export function setLocalStorage() {
  localStorage.setItem('workouts', JSON.stringify(state.storage.workouts));
}

export function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem('workouts'));

  if (!data) return;

  state.storage.workouts = data;

  state.storage.workouts.forEach(work => {
    renderWorkout(work);
  });
}
