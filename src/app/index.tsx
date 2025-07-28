import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to camera screen on app launch
  return <Redirect href="/camera" />;
}
