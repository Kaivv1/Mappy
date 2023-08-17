import { state } from '../data.js';

export function edit() {
  const editButtons = document.querySelectorAll('.edit--btn');

  editButtons.forEach(editBtn => {
    editBtn.addEventListener('click', handleEditButtonClick);
  });

  function handleEditButtonClick(e) {
    const workoutEl = e.target.closest('.workout');

    const workoutValues = workoutEl.querySelectorAll('.workout__value');

    workoutValues.forEach(w => {
      w.setAttribute('contenteditable', 'true');
      w.addEventListener('keydown', preventNewline);
      w.addEventListener('input', handleValueChange);
    });

    const doneBtn = workoutEl.querySelector('.done');
    doneBtn.classList.remove('hidden');

    doneBtn.addEventListener('click', () => {
      localStorage.setItem('workouts', JSON.stringify(state.storage.workouts));

      workoutValues.forEach(w => {
        w.setAttribute('contenteditable', 'false');
      });

      doneBtn.classList.add('hidden');
    });
  }

  function preventNewline(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }

  function handleValueChange(e) {
    const workoutEl = e.target.closest('.workout');
    const workoutId = workoutEl.dataset.id;
    const workout = state.storage.workouts.find(work => work.id === workoutId);

    const classList = e.target.classList;

    if (classList.contains('value__distance')) {
      workout.distance = parseFloat(e.target.innerHTML) || 0;
      if (e.target.innerHTML === '') {
        return (e.target.innerHTML = 0);
      }
    } else if (classList.contains('value__duration')) {
      workout.duration = parseFloat(e.target.innerHTML) || 0;
      if (e.target.innerHTML === '') {
        return (e.target.innerHTML = 0);
      }
    } else if (classList.contains('value__cadence')) {
      workout.cadence = parseFloat(e.target.innerHTML) || 0;
    } else if (classList.contains('value__elevation')) {
      workout.elevationGain = parseFloat(e.target.innerHTML) || 0;
    }

    // Update the UI with calculated values
    const paceElement = workoutEl.querySelector('.value__pace');
    const speedElement = workoutEl.querySelector('.value__speed');
    const cadenceElement = workoutEl.querySelector('.value__cadence');
    const elevationElement = workoutEl.querySelector('.value__elevation');

    if (elevationElement) {
      const speedMs = (workout.speed * 1000) / 3600;
      workout.elevationGain = ((workout.duration * 60) / 3600) * speedMs || 0;
      elevationElement.innerHTML = workout.elevationGain.toFixed(0);
    }

    if (cadenceElement) {
      workout.cadence =
        ((workout.distance * 1000) / (workout.duration * 60)) * 60 || 0;
      cadenceElement.innerHTML = workout.cadence.toFixed(0);
    }

    if (paceElement) {
      workout.pace = workout.distance / workout.duration || 0;
      paceElement.innerHTML = workout.pace.toFixed(1);
    }

    if (speedElement) {
      workout.speed = workout.distance / (workout.duration / 60) || 0;
      speedElement.innerHTML = workout.speed.toFixed(1);
    }
  }
}
