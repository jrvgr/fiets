/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
    class BarcodeDetector {
      constructor(options?: BarcodeDetectorOptions);
      detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
    }
  
    interface BarcodeDetectorOptions {
      formats?: string[];
    }
  
    interface DetectedBarcode {
      boundingBox: DOMRectReadOnly;
      cornerPoints: Point2D[];
      format: string;
      rawValue: string;
    }
  
    interface Point2D {
      x: number;
      y: number;
    }
  }
