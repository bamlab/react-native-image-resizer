const ImageResizer = require('./NativeImageResizer').default;

export function addition(a: number, b: number): number {
  return ImageResizer.addition(a, b);
}

export function multiply(a: number, b: number): number {
  return ImageResizer.multiply(a, b);
}
