import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  addition(a: number, b: number): number;
  createdResizedImage(
    uri: string,
    width: number,
    height: number,
    format: string,
    quality: number,
    rotation?: number,
    outputPath?: string,
    keepMeta?: boolean,
    mode?: string,
    onlyScaleDown?: boolean
  ): Promise<{
    path: string;
    uri: string;
    size: number;
    name: string;
    width: number;
    height: number;
    base64: string;
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageResizer');
