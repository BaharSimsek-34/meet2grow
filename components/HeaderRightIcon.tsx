// components/HeaderRightIcon.tsx

import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/IconSymbol';

// DEĞİŞİKLİK: Bileşen artık 'color' adında bir prop alıyor.
export function HeaderRightIcon({ color }: { color: string }) {
  const router = useRouter();

  const goToProfile = () => {
    router.push('./profile');
  };

  return (
    <TouchableOpacity onPress={goToProfile} style={styles.button}>
      {/* DEĞİŞİKLİK: Prop olarak gelen renk kullanılıyor. */}
      <IconSymbol name="person.circle.fill" size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
});