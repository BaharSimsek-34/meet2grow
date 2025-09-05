// components/HeaderIcons.tsx

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/IconSymbol'; // IconSymbol bileşeninizin yolu
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function HeaderIcons() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  // Header rengiyle uyumlu olması için metin rengini kullanıyoruz
  const iconColor = Colors[colorScheme ?? 'light'].text;

  const goToMessages = () => {
    router.push('./messages'); // Mesajlar sayfasına yönlendir
  };

  const goToProfile = () => {
    router.push('./profile'); // Profil sayfasına yönlendir
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToMessages} style={styles.button}>
        <IconSymbol name="message.fill" size={24} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToProfile} style={styles.button}>
        <IconSymbol name="person.circle.fill" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  button: {
    marginLeft: 20,
  },
});