declare module 'mammoth' {
  export interface Options {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
    styleMap?: string[];
  }
  export interface Result {
    value: string;
    messages: any[];
  }
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }, options?: any): Promise<Result>;
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }, options?: any): Promise<Result>;
}
