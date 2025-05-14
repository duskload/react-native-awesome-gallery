export const clamp = (value, min, max) => {
  'worklet';
  return Math.max(Math.min(value, max), min);
};
export const rubberBandClamp = (x, coeff, dim) => {
  'worklet';
  return (1.0 - 1.0 / ((x * coeff) / dim + 1.0)) * dim;
};
export const withRubberBandClamp = (x, coeff, dim, limits) => {
  'worklet';
  let clampedX = clamp(x, limits[0], limits[1]);
  let diff = Math.abs(x - clampedX);
  let sign = clampedX > x ? -1 : 1;
  return clampedX + sign * rubberBandClamp(diff, coeff, dim);
};
