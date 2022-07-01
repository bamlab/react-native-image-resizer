const ImageResizer = require('./NativeImageResizer').default

export function multiply(a: number, b: number): number {
  return ImageResizer.multiply(a, b);
}
