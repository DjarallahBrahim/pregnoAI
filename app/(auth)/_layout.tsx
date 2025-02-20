import { Stack } from 'expo-router';
import { Text } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Login',
        }} 
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: 'Welcome',
          headerShown: false,
        }}
      />
    </Stack>
  );
}