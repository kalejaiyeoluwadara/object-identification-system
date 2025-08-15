import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraType, FlashMode, CameraView } from "expo-camera";
import { useRouter, useFocusEffect } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);
  const [cameraType, setCameraType] = useState("back");
  const [flashMode, setFlashMode] = useState("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [key, setKey] = useState(0); // Force re-render key
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // Handle camera focus/unfocus to restart camera when returning
  useFocusEffect(
    React.useCallback(() => {
      // Reset camera state when screen comes into focus
      setIsCameraReady(false);
      setKey((prev) => prev + 1); // Force camera re-render

      return () => {
        // Cleanup when screen loses focus
        setIsCameraReady(false);
      };
    }, [])
  );

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && isCameraReady) {
      try {
        setIsCapturing(true);
        // CameraView exposes a takePhoto method
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6, // Reduced quality for faster processing
          base64: false,
          exif: false, // Disable EXIF data to reduce file size
          skipProcessing: true, // Skip additional processing for speed
        });

        // Save to a permanent location in the app's documents directory
        const fileName = `object_detection_${Date.now()}.jpg`;
        const permanentUri = `${FileSystem.documentDirectory}${fileName}`;

        // Copy the temporary file to permanent location
        await FileSystem.copyAsync({
          from: photo.uri,
          to: permanentUri,
        });

        if (hasMediaLibraryPermission) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }

        router.push({
          pathname: "/result",
          params: { imageUri: permanentUri },
        });
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
        console.error("Camera error:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType((current) => (current === "back" ? "front" : "back"));
    // Force camera restart when switching types
    setKey((prev) => prev + 1);
  };

  const toggleFlash = () => {
    setFlashMode((current) => (current === "off" ? "on" : "off"));
  };

  const restartCamera = () => {
    setKey((prev) => prev + 1);
    setIsCameraReady(false);
  };

  if (hasCameraPermission === null) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-4">
        <Ionicons name="camera-outline" size={80} color="#666" />
        <Text className="text-white text-xl font-bold mt-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Please enable camera access in your device settings to use object
          detection.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        key={key} // Force re-render when key changes
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraType as CameraType}
        flash={flashMode as FlashMode}
        ratio="16:9"
        onCameraReady={handleCameraReady}
      >
        <View className="flex-1 justify-between">
          {/* Top Controls */}
          <View className="flex-row justify-between items-center pt-12 px-6">
            <TouchableOpacity
              onPress={toggleFlash}
              className="w-12 h-12 bg-black/50 rounded-full justify-center items-center"
            >
              <Ionicons
                name={flashMode === "on" ? "flash" : "flash-off"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <Text className="text-white text-lg font-semibold">
              Object Detection
            </Text>

            <TouchableOpacity
              onPress={toggleCameraType}
              className="w-12 h-12 bg-black/50 rounded-full justify-center items-center"
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center Guide */}
          <View className="flex-1 justify-center items-center">
            <View className="w-64 h-64 border-2 border-white/30 border-dashed rounded-lg">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
            </View>
            <Text className="text-white/80 text-sm mt-4 text-center">
              Point camera at objects to detect them
            </Text>
          </View>

          {/* Bottom Controls */}
          <View className="pb-8 px-6">
            <View className="flex-row justify-center items-center">
              <TouchableOpacity
                onPress={takePicture}
                disabled={isCapturing || !isCameraReady}
                className={`w-20 h-20 rounded-full border-4 border-white justify-center items-center ${
                  isCapturing || !isCameraReady ? "bg-gray-600" : "bg-white/20"
                }`}
              >
                {isCapturing ? (
                  <View className="w-4 h-4 bg-white rounded" />
                ) : !isCameraReady ? (
                  <View className="w-4 h-4 bg-gray-400 rounded" />
                ) : (
                  <View className="w-16 h-16 bg-white rounded-full" />
                )}
              </TouchableOpacity>
            </View>

            {/* Camera Status and Restart Button */}
            <View className="flex-row justify-center items-center mt-4 space-x-4">
              {!isCameraReady && (
                <TouchableOpacity
                  onPress={restartCamera}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-semibold">
                    Restart Camera
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text className="text-white/60 text-center text-sm mt-4">
              {isCameraReady
                ? "Tap to capture and analyze objects"
                : "Camera initializing..."}
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
