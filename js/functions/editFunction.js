import { state } from '../data.js';

export function edit() {
  const editBtn = document.querySelector('.edit--btn');
  editBtn.addEventListener('click', e => {
    const workoutEl = e.target.closest('.workout');

    const workoutValues = workoutEl.querySelectorAll('.workout__value');

    workoutValues.forEach(w => {
      w.setAttribute('contenteditable', 'true');
      w.addEventListener('keypress', e => {
        if (e.which === 13 || e.which === 32) e.preventDefault();
      });
    });

    const doneBtn = workoutEl.querySelector('.done');
    doneBtn.classList.remove('hidden');

    doneBtn.addEventListener('click', () => {
      const workout = state.storage.workouts.find(
        work => work.id === workoutEl.dataset.id
      );

      workoutValues.forEach(w => {
        if (w.classList.contains('value__distance')) {
          const distanceV =
            document.querySelector('.value__distance').innerHTML;
          workout.distance = +distanceV;
        }

        if (w.classList.contains('value__duration')) {
          const durationV =
            document.querySelector('.value__duration').innerHTML;
          workout.duration = +durationV;
        }

        if (w.classList.contains('value__pace')) {
          const paceV = document.querySelector('.value__pace').innerHTML;
          workout.pace = Number.parseFloat(paceV).toFixed(1);
        }

        if (w.classList.contains('value__cadence')) {
          const cadenceV = document.querySelector('.value__cadence').innerHTML;
          workout.cadence = +cadenceV;
        }

        if (w.classList.contains('value__elevation')) {
          const elevationV =
            document.querySelector('.value__elevation').innerHTML;
          workout.elevationGain = +elevationV;
        }

        if (w.classList.contains('value__speed')) {
          const speedV = document.querySelector('.value__speed').innerHTML;
          workout.speed = Number.parseFloat(speedV).toFixed(1);
        }

        let edited = JSON.parse(localStorage.getItem('workouts'));
        edited = state.storage.workouts;
        localStorage.setItem('workouts', JSON.stringify(edited));
        w.setAttribute('contenteditable', 'false');
      });
      doneBtn.classList.add('hidden');
    });
  });
}
