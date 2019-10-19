declare module 'react-native-image-resizer' {
  export interface Response {
    path: string;
    uri: string;
    size?: number;
    name?: string;
    width: number;
    height: number;
  }

  export default class ImageResizer {
    static createResizedImage(
      uri: string,
      width: number,
      height: number,
      format: 'PNG' | 'JPEG' | 'WEBP',
      quality: number,
      rotation?: number,
      outputPath?: string
    ): Promise<Response>;
  }
}
