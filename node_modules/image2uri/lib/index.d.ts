export declare const validUrl: (url: string) => boolean;
export declare const extTypeMap: {
    '.png': string;
    '.apng': string;
    '.gif': string;
    '.jpg': string;
    '.jpeg': string;
    '.bm': string;
    '.bmp': string;
    '.webp': string;
    '.ico': string;
    '.svg': string;
};
export type ExtType = keyof typeof extTypeMap;
export default function image2uri(file: string, options?: {
    ext?: string;
}): string | Promise<string>;
