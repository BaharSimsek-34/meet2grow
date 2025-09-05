import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      {/* Bu ekran için özel bir başlık belirleyebilirsiniz */}
      <Stack.Screen options={{ title: 'Mesajlar' }} />
      <Text style={styles.text}>Mesajlar Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});