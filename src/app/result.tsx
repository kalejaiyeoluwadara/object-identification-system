import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { detectObjects } from "../utils/objectDetection";
import { Detection } from "../utils/types";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("Initializing...");

  useEffect(() => {
    if (imageUri) {
      analyzeImage();
    }
  }, [imageUri]);

  const analyzeImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep("Processing image...");

      // Add a small delay to show the loading step
      await new Promise((resolve) => setTimeout(resolve, 100));

      setLoadingStep("Analyzing your image...");
      const results = await detectObjects(imageUri);
      setDetections(results);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error("Detection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const retakePicture = () => {
    // Navigate back to camera screen, which will trigger camera reinitialization
    router.push("/camera");
  };

  if (!imageUri) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">No image provided</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Display */}
        <View className="relative">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-80"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
        </View>

        {/* Analysis Section */}
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-2xl font-bold">
              Analysis Results
            </Text>
            <TouchableOpacity
              onPress={retakePicture}
              className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Ionicons name="camera" size={16} color="white" />
              <Text className="text-white font-semibold ml-2">Retake</Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <View className="py-12">
              <LoadingSpinner />
              <Text className="text-gray-400 text-center mt-4 text-lg">
                {loadingStep}
              </Text>
              <Text className="text-gray-500 text-center mt-2 text-sm">
                This may take a few seconds...
              </Text>
            </View>
          )}

          {error && (
            <View className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={24} color="#ef4444" />
                <Text className="text-red-400 font-semibold ml-2">Error</Text>
              </View>
              <Text className="text-red-300 mt-2">{error}</Text>
              <TouchableOpacity
                onPress={analyzeImage}
                className="bg-red-600 px-4 py-2 rounded mt-3 self-start"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isLoading && !error && (
            <>
              {detections.length > 0 ? (
                <>
                  <View className="bg-gray-900/50 rounded-lg p-4 mb-6">
                    <Text className="text-white text-lg font-semibold mb-2">
                      Analysis Summary
                    </Text>
                    <Text className="text-gray-300">
                      Analyzed your image and identified the object
                    </Text>
                  </View>

                  <View className="space-y-4">
                    {detections.map((detection, index) => (
                      <View
                        key={index}
                        className="bg-gray-900/30 border border-gray-700 rounded-lg p-4"
                      >
                        <View className="mb-3">
                          <Text className="text-white text-xl font-semibold capitalize">
                            {detection.itemname}
                          </Text>
                        </View>

                        <View className="bg-gray-800 rounded-lg p-3">
                          <Text className="text-gray-300 text-sm leading-relaxed">
                            {detection.description}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <View className="bg-gray-900/30 border border-gray-700 rounded-lg p-8 text-center">
                  <Ionicons name="search" size={48} color="#6b7280" />
                  <Text className="text-gray-300 text-lg font-semibold mt-4 text-center">
                    No Objects Identified
                  </Text>
                  <Text className="text-gray-400 mt-2 text-center">
                    Try taking a photo with a clearer view of the object you
                    want to identify.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
