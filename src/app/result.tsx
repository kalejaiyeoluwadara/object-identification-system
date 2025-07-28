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

  useEffect(() => {
    if (imageUri) {
      analyzeImage();
    }
  }, [imageUri]);

  const analyzeImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
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
    router.back();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getConfidenceText = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
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
              <Text className="text-gray-400 text-center mt-4">
                Analyzing image...
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
                      Detection Summary
                    </Text>
                    <Text className="text-gray-300">
                      Found {detections.length} object
                      {detections.length !== 1 ? "s" : ""} in the image
                    </Text>
                  </View>

                  <View className="space-y-4">
                    {detections.map((detection, index) => (
                      <View
                        key={index}
                        className="bg-gray-900/30 border border-gray-700 rounded-lg p-4"
                      >
                        <View className="flex-row justify-between items-start mb-3">
                          <Text className="text-white text-xl font-semibold capitalize flex-1">
                            {detection.class}
                          </Text>
                          <View className="bg-gray-800 px-3 py-1 rounded-full">
                            <Text
                              className={`font-semibold ${getConfidenceColor(detection.score)}`}
                            >
                              {getConfidenceText(detection.score)}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-center">
                          <Text className="text-gray-400">
                            Confidence: {(detection.score * 100).toFixed(1)}%
                          </Text>
                          <View className="flex-row items-center">
                            <Ionicons
                              name="location"
                              size={16}
                              color="#9ca3af"
                            />
                            <Text className="text-gray-400 ml-1">
                              ({detection.bbox[0].toFixed(0)},{" "}
                              {detection.bbox[1].toFixed(0)})
                            </Text>
                          </View>
                        </View>

                        <View className="mt-3 bg-gray-800 rounded h-2">
                          <View
                            className={`h-full rounded ${
                              detection.score >= 0.8
                                ? "bg-green-500"
                                : detection.score >= 0.6
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${detection.score * 100}%` }}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <View className="bg-gray-900/30 border border-gray-700 rounded-lg p-8 text-center">
                  <Ionicons name="search" size={48} color="#6b7280" />
                  <Text className="text-gray-300 text-lg font-semibold mt-4 text-center">
                    No Objects Detected
                  </Text>
                  <Text className="text-gray-400 mt-2 text-center">
                    Try taking a photo with more recognizable objects or better
                    lighting.
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
