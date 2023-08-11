'use strict';
import { Running, Cycling } from './workoutView.js';
import * as config from './config.js';

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  // marker;
  markers = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    config.form.addEventListener('submit', this._newWorkout.bind(this));
    config.inputType.addEventListener('change', this._toggleElevationField);
    config.containerWorkouts.addEventListener(
      'click',
      this._moveToPopup.bind(this)
    );
    console.log(this.#workouts);
    console.log(this.markers);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    config.form.classList.remove('hidden');
    config.inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    config.inputDistance.value =
      config.inputDuration.value =
      config.inputCadence.value =
      config.inputElevation.value =
        '';

    config.form.style.display = 'none';
    config.form.classList.add('hidden');
    setTimeout(() => (config.form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    config.inputElevation
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
    config.inputCadence
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    // Get data from form
    const type = config.inputType.value;
    const distance = +config.inputDistance.value;
    const duration = +config.inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +config.inputCadence.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +config.inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Creating a marker
    // this._createMarker(workout);

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkout(workout) {
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
          <span class="workout__value value__duration">${
            workout.duration
          }</span>
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
    this._edit();

    this._deleteWorkout();
  }

  _renderWorkoutMarker(workout) {
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

    this.#map.addLayer(marker);
    marker.openPopup();

    this.markers.push({ marker });
    console.log(marker);
  }

  _moveToPopup(e) {
    if (!this.#map) return;

    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    if (!workout) return;
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  _resetLocalStorage() {
    let workouts = JSON.parse(localStorage.getItem('workouts'));
    workouts = this.#workouts;
    localStorage.setItem('workouts', JSON.stringify(workouts));
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  _edit() {
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
        const workout = this.#workouts.find(
          work => work.id === workoutEl.dataset.id
        );

        workoutValues.forEach(w => {
          if (w.classList.contains('value__distance')) {
            const distanceV =
              document.querySelector('.value__distance').innerHTML;
            workout.distance = +distanceV;
            console.log(+distanceV);
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
            const cadenceV =
              document.querySelector('.value__cadence').innerHTML;
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
          edited = this.#workouts;
          localStorage.setItem('workouts', JSON.stringify(edited));
          w.setAttribute('contenteditable', 'false');
        });
        doneBtn.classList.add('hidden');
      });
    });
  }

  _clearMarker(curEl) {
    this.markers.forEach(marker => {
      if (
        curEl.coords[0] === marker.marker._latlng.lat &&
        curEl.coords[1] === marker.marker._latlng.lng
      ) {
        const index = this.markers.indexOf(marker);
        this.#map.removeLayer(marker.marker);
        this.markers.splice(index, 1);
      }
    });
  }

  _deleteWorkout() {
    const delBtn = document.querySelector('.remove--btn');
    delBtn.addEventListener('click', e => {
      const workout = e.target.parentElement;
      const curEl = this.#workouts.find(work => work.id === workout.dataset.id);

      this._clearMarker(curEl);
      const index = this.#workouts.indexOf(curEl);
      this.#workouts.splice(index, 1);
      config.containerWorkouts.removeChild(workout);

      let workouts = JSON.parse(localStorage.getItem('workouts'));
      workouts = this.#workouts;
      localStorage.setItem('workouts', JSON.stringify(workouts));
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
// app.reset(); // izpolzvai za da resnesh vsichko
