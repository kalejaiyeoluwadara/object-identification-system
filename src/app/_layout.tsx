import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Object Detection",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="camera"
          options={{
            title: "Camera",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: "Detection Results",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </>
  );
}
