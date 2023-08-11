export function reset() {
  localStorage.removeItem('workouts');
  location.reload();
}

export const validInputs = (...inputs) =>
  inputs.every(inp => Number.isFinite(inp));

export const allPositive = (...inputs) => inputs.every(inp => inp > 0);
