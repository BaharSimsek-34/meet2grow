// components/HeaderLeftIcon.tsx

import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/IconSymbol';

// DEĞİŞİKLİK: Bileşen artık 'color' adında bir prop alıyor.
export function HeaderLeftIcon({ color }: { color: string }) {
  const router = useRouter();

  const goToMessages = () => {
    router.push('./messages');
  };

  return (
    <TouchableOpacity onPress={goToMessages} style={styles.button}>
      {/* DEĞİŞİKLİK: Prop olarak gelen renk kullanılıyor. */}
      <IconSymbol name="message.fill" size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 15,
  },
});