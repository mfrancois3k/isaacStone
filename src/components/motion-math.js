// Fractions are specified at 60Hz, then normalized to the elapsed frame time.
export const frameAlpha = (fraction, dt) => 1 - Math.pow(1 - fraction, dt);
export const normalizedVelocity = (previous, deltaY, dt) =>
  previous + (deltaY / dt - previous) * frameAlpha(.12, dt);
export const galleryHeight = (trackWidth, viewportWidth, viewportHeight) =>
  viewportHeight + Math.max(0, trackWidth - viewportWidth);
