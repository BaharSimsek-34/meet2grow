// src/components/GroupCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
  Animated, // Animasyon için eklendi
} from 'react-native';
import { Group } from '../models/models'; // Modelinizin yolunu projenize göre güncelleyin

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  // Animasyon için bir değer oluşturuyoruz. Başlangıç değeri 1 (normal boyut).
  const [scaleValue] = useState(new Animated.Value(1));

  // Fare üzerine gelindiğinde veya dokunulduğunda kartı büyüten fonksiyon
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.05, // %5 büyüt
      friction: 6,
      useNativeDriver: true, // Performans için native driver kullan
    }).start();
  };

  // Fare çekildiğinde veya dokunma bırakıldığında kartı eski boyutuna getiren fonksiyon
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      // Web'de hover durumları için (opsiyonel ama önerilir)
      onHoverIn={handlePressIn}
      onHoverOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
        <ImageBackground
          source={{ uri: group.picture }} // Resim URL'si modelden alınıyor
          style={styles.imageBackground}
          imageStyle={styles.image}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2}>{group.title}</Text>
            <View style={styles.footer}>
              <Text style={styles.typeText}>{group.type === 'private' ? 'Özel' : 'Herkese Açık'}</Text>
              <Text style={styles.memberText}>{group.memberCount} üye</Text>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
};

const { width } = Dimensions.get('window');
// Her sırada 2 kart olacak şekilde genişlik ayarı
const cardSize = (width - 48) / 2; // 16 (sol) + 16 (sağ) + 16 (aradaki) boşluk

const styles = StyleSheet.create({
  card: {
    width: cardSize,
    height: cardSize,
    borderRadius: 12,
    margin: 8,
    elevation: 5, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden', // Resmin köşelerden taşmasını engeller
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // İçeriği (overlay) en alta hizala
  },
  image: {
    borderRadius: 12, // ImageBackground'ın kendi resmine border radius uygula
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Resim üzerine hafif karanlık bir katman
    padding: 10,
    borderBottomLeftRadius: 12, // Köşeleri yuvarlak tut
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Beyaz metin
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E0E0E0', // Biraz daha soluk beyaz
    textTransform: 'uppercase',
  },
  memberText: {
    fontSize: 10,
    color: '#E0E0E0',
  },
});

export default GroupCard;