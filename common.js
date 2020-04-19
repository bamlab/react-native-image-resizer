/** Validate `options` object: used by both Android and iOS entry points */
export function validateOptions(options) {
  const mode = options.mode || 'stretch';
  const possibleModes = ['contain', 'cover', 'stretch'];
  if (possibleModes.indexOf(mode) === -1) {
    throw new Error(`createResizedImage's options.mode must be one of "${possibleModes.join('", "')}"`);
  }

  if (options.onlyScaleDown && typeof options.onlyScaleDown !== 'boolean') {
    throw new Error(`createResizedImage\'s option.onlyScaleDown must be a boolean: got ${options.onlyScaleDown}`);
  }

  return {
    mode,
    onlyScaleDown: !!options.onlyScaleDown,
  };
}
