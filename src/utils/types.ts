export interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

export interface ObjectDetectionModel {
  detect: (input: any) => Promise<Detection[]>;
}
