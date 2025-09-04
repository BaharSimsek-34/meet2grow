import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
//import RNBootSplash from 'react-native-bootsplash';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
const cream_color = '#FEFDE4'; 
export default function RootLayout() {
  useEffect(() => {
    // Bu bileşen (yani tüm uygulama) ekrana çizilmeye hazır olduğunda,
    // açılış ekranını yavaşça kaybolacak şekilde gizle.
    //RNBootSplash.hide({ fade: true });
  }, []);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
          // Header'ın arka plan rengi (isteğe bağlı)
          headerStyle: {
            backgroundColor: cream_color,
          },
          // Header başlık rengi (isteğe bağlı)
          headerTintColor: '#1A1A1A',
          // Header'daki gölgeyi kaldırmak (isteğe bağlı)
          headerShadowVisible: false,

          // --- TÜM EKRANLARIN ARKA PLANINI DEĞİŞTİREN KISIM ---
          contentStyle: {
            backgroundColor: cream_color,
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
