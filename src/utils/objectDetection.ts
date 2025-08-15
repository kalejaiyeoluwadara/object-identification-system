import { Detection } from "./types";
import * as FileSystem from "expo-file-system";

const API_ENDPOINT = "https://gemini-api-46ez.onrender.com/vision/identify";

export const detectObjects = async (imageUri: string): Promise<Detection[]> => {
  try {
    console.log("Starting object detection for image:", imageUri);

    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error(`Image file does not exist: ${imageUri}`);
    }

    console.log("File exists, size:", fileInfo.size);

    // Read the image file as base64
    const imageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Image data loaded, length:", imageData.length);

    // Create form data to send the image
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);

    console.log("Sending request to API...");

    // Make the API request
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API response:", result);

    // Convert the API response to our Detection interface
    const detection: Detection = {
      itemname: result.itemname,
      description: result.description,
    };

    return [detection];
  } catch (error) {
    console.error("Object detection failed:", error);
    throw error;
  }
};
