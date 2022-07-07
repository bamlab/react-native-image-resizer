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
