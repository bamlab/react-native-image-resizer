import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  createResizedImage(
    uri: string,
    width: number,
    height: number,
    format: string,
    quality: number,
    mode: string,
    onlyScaleDown: boolean,
    rotation?: number,
    outputPath?: string | null,
    keepMeta?: boolean
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
