import React from "react";
import { View, ActivityIndicator } from "react-native";

const LoadingSpinner: React.FC = () => {
  return (
    <View className="justify-center items-center">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
};

export default LoadingSpinner;
