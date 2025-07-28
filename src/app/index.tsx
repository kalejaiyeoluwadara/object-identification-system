import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to camera screen on app launch
    router.replace('/camera');
  }, []);

  return (
    <View className="flex-1 bg-black" />
  );
}