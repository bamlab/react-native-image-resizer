declare module 'react-native-image-resizer' {
  export interface Response {
    path: string;
    uri: string;
    size: number;
    name: string;
    width: number;
    height: number;
  }

  export type ResizeFormat = 'PNG' | 'JPEG' | 'WEBP';
  export type ResizeMode = 'contain' | 'cover' | 'stretch';

  export default class ImageResizer {
    static createResizedImage(
      uri: string,
      width: number,
      height: number,
      format: ResizeFormat,
      quality: number,
      rotation?: number,
      outputPath?: string,
      keepMeta?: boolean,
      options?: {
        /** 
         * Either `contain` (the default), `cover`, or `stretch`. Similar to 
         * [react-native <Image>'s resizeMode](https://reactnative.dev/docs/image#resizemode)
         * 
         * - `contain` will fit the image within `width` and `height`,
         *   preserving its ratio
         * - `cover` will make sure at least one dimension fits `width` or
         *   `height`, and the other is larger, also preserving its ratio.
         * - `stretch` will resize the image to exactly `width` and `height`.
         *   
         * (Default: 'contain')
         */
        mode?: ResizeMode;
        /** 
         * Whether to avoid resizing the image to be larger than the original.
         * (Default: false)
         */
        onlyScaleDown?: boolean;
      },
    ): Promise<Response>;
  }
}
