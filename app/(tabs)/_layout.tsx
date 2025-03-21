import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

const TAB_BAR_HEIGHT = 40;

// Define prop types for TabIcon component
interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
}

// Reusable component for tab icons
const TabIcon = ({ name, color, size }: TabIconProps) => (
  <View style={[
    styles.iconContainer,
    { backgroundColor: color === theme.colors.primary ? 'rgba(255, 143, 177, 0.1)' : 'transparent' }
  ]}>
    <Ionicons name={name} size={size} color={color} />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useMemo(() => TAB_BAR_HEIGHT + insets.bottom, [insets.bottom]);

  const screenOptions = useMemo((): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarStyle: {
      ...styles.tabBar,
      height: tabBarHeight,
      marginBottom: Platform.OS === 'ios' ? 20 : 10,
      paddingBottom: insets.bottom,
      
    },
    tabBarItemStyle: {
      height: tabBarHeight,
      paddingVertical: 8,
    },
    tabBarIconStyle: {
      marginBottom: 4,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '500' as TextStyle['fontWeight'],
      marginBottom: insets.bottom,
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.text.secondary,
  }), [tabBarHeight, insets.bottom]);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="baby"
        options={{
          title: 'My Baby',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="body-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mom"
        options={{
          title: 'Mom',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="apps" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 0,
    borderRadius: 30,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    padding: 0,
    borderRadius: 16,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});