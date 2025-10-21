
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const activeIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    const newIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
    if (newIndex >= 0) {
      indicatorPosition.value = withSpring(newIndex, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [pathname, tabs, indicatorPosition]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => i * tabWidth)
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView
      style={[styles.safeArea, { bottom: bottomMargin }]}
      edges={['bottom']}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        <BlurView
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
          style={[styles.blurContainer, { borderRadius }]}
        >
          <View style={styles.tabBar}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: containerWidth / tabs.length,
                  backgroundColor: colors.primary,
                },
                animatedIndicatorStyle,
              ]}
            />
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.name);
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon as any}
                    size={24}
                    color={isActive ? '#ffffff' : colors.text}
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isActive ? '#ffffff' : colors.text,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    height: 70,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.9)',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    borderRadius: 20,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
