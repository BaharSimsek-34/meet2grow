// app/_layout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// YENİ: Dinamik başlık için gerekli yardımcı fonksiyonu import ediyoruz.
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { Colors } from '@/constants/Colors'; 
import { HeaderLeftIcon } from '@/components/HeaderLeftIcon';
import { HeaderRightIcon } from '@/components/HeaderRightIcon';

const cream_color = '#FEFDE4'; 

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const iconColor = Colors[colorScheme ?? 'light'].text;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
          headerStyle: {
            //backgroundColor: cream_color,
          },
    
          headerShadowVisible: false,
          contentStyle: {
           // backgroundColor: cream_color,
          },
        }}>
        
        <Stack.Screen 
          name="(tabs)" 
          // DEĞİŞİKLİK: 'options' artık bir obje değil, 'route' alan bir fonksiyon.
          options={({ route }) => {
            // Aktif olan sekmenin adını (index, groups, nearby) alıyoruz.
            // Uygulama ilk açıldığında 'undefined' olabileceği için 'index' (Home) olarak varsayıyoruz.
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

            // Sekme adına göre gösterilecek başlığı belirliyoruz.
            let headerTitle;
            switch (routeName) {
              case 'groups':
                headerTitle = 'Gruplar';
                break;
              case 'nearby':
                headerTitle = 'Yakınımdaki';
                break;
              case 'index':
              default:
                headerTitle = 'Home';
                break;
            }

            // Dinamik başlık ile birlikte tüm seçenekleri geri döndürüyoruz.
            return {
              headerShown: true,
              headerLeft: () => <HeaderLeftIcon color={iconColor} />,
              headerRight: () => <HeaderRightIcon color={iconColor} />,
              headerTitleAlign: 'center',
              title: headerTitle, // Dinamik başlığı burada kullanıyoruz
            };
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}