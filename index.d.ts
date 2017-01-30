declare module "react-native-image-resizer" {
    export function createResizedImage(
        uri: string, width: number, height: number,
        format: "PNG" | "JPEG" | "WEBP", quality: number,
        rotation?: number, outputPath?: string
    ): Promise<string>;
}
