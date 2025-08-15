export interface Detection {
  itemname: string;
  description: string;
}

export interface ObjectDetectionModel {
  detect: (input: any) => Promise<Detection[]>;
}
