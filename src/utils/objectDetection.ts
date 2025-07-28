import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { Detection } from "./types";

let model: cocoSsd.ObjectDetection | null = null;

export const initializeModel = async (): Promise<void> => {
  try {
    await tf.ready();
    model = await cocoSsd.load();
    console.log("Object detection model loaded successfully");
  } catch (error) {
    console.error("Failed to load model:", error);
    throw error;
  }
};

export const detectObjects = async (imageUri: string): Promise<Detection[]> => {
  try {
    if (!model) {
      await initializeModel();
    }

    if (!model) {
      throw new Error("Model failed to initialize");
    }

    // Load and preprocess the image
    const response = await fetch(imageUri, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const imageData = await response.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageData));

    // Perform object detection
    const predictions = await model.detect(imageTensor);

    // Clean up tensor
    imageTensor.dispose();

    // Convert predictions to our Detection interface
    const detections: Detection[] = predictions.map((prediction: any) => ({
      bbox: prediction.bbox as [number, number, number, number],
      class: prediction.class,
      score: prediction.score,
    }));

    return detections.filter((detection) => detection.score > 0.5); // Filter low confidence detections
  } catch (error) {
    console.error("Object detection failed:", error);
    throw error;
  }
};
