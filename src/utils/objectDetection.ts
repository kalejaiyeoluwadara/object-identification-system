import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { Detection } from "./types";
import * as FileSystem from "expo-file-system";

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

// Helper function to convert base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const detectObjects = async (imageUri: string): Promise<Detection[]> => {
  try {
    console.log("Starting object detection for image:", imageUri);

    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error(`Image file does not exist: ${imageUri}`);
    }

    console.log("File exists, size:", fileInfo.size);

    if (!model) {
      console.log("Initializing model...");
      await initializeModel();
    }

    if (!model) {
      throw new Error("Model failed to initialize");
    }

    console.log("Loading image data...");
    // Load image data using FileSystem instead of fetch
    const imageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Image data loaded, length:", imageData.length);

    // Convert base64 to Uint8Array
    const imageBytes = base64ToUint8Array(imageData);
    console.log("Image bytes converted, length:", imageBytes.length);

    const imageTensor = decodeJpeg(imageBytes);
    console.log("Image tensor created");

    // Perform object detection
    console.log("Running object detection...");
    const predictions = await model.detect(imageTensor);

    // Clean up tensor
    imageTensor.dispose();
    console.log("Detection complete, found", predictions.length, "objects");

    // Convert predictions to our Detection interface
    const detections: Detection[] = predictions.map((prediction: any) => ({
      bbox: prediction.bbox as [number, number, number, number],
      class: prediction.class,
      score: prediction.score,
    }));

    const filteredDetections = detections.filter(
      (detection) => detection.score > 0.5
    );
    console.log(
      "Filtered to",
      filteredDetections.length,
      "high-confidence detections"
    );

    return filteredDetections;
  } catch (error) {
    console.error("Object detection failed:", error);
    throw error;
  }
};
