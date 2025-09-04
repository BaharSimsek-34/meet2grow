import React, { useRef } from 'react';
import { Event } from '../models/models'; // Model yolunuzu doğrulayın
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';

// --- Yeni Renk Paleti ---
const COLORS = {
  primaryBlack: '#1A1A1A',      // Ana arka plan rengi (koyu gri/siyah)
  primaryYellow: '#FFD700',    // Vurgu ve buton rengi (altın sarısı)
  textPrimary: '#FFFFFF',      // Ana metin rengi (beyaz)
  textSecondary: '#A9A9A9',    // İkincil metin rengi (tarih vb. için gri)
};

// Bileşenin alacağı props'ları tanımlıyoruz
interface EventCardProps {
  event: Event;
  isLoggedIn: boolean; // Kullanıcının giriş yapıp yapmadığı bilgisi
  onPress: () => void; // Karta tıklandığında çalışacak fonksiyon
  onLoginPress: () => void; // Hızlı giriş butonuna tıklandığında çalışacak fonksiyon
}

const EventCard: React.FC<EventCardProps> = ({ event, isLoggedIn, onPress, onLoginPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.05,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };
  
  const isTeaser = !isLoggedIn && event.isPrivate;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x200.png?text=Etkinlik' }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>
            {isTeaser ? 'Özel Bir Grubun Etkinliği' : event.title}
          </Text>
          <Text style={styles.date}>{formatDate(event.date)}</Text>
          
          {isLoggedIn ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>📍 Yer: {event.location}</Text>
              <Text style={styles.detailText}>👥 Katılımcılar: {event.participants.length} kişi</Text>
            </View>
          ) : (
            // --- KULLANICI GİRİŞ YAPMADIĞINDA GÖSTERİLECEK YENİ BÖLÜM ---
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>
                {isTeaser 
                  ? "Detayları görmek ve katılmak için gruba üye olun."
                  : "Katılımcıları ve konumu görmek için giriş yapın."
                }
              </Text>
              {/* --- SARI RENKLİ HIZLI GİRİŞ BUTONU --- */}
              <Pressable style={styles.loginButton} onPress={onLoginPress}>
                <Text style={styles.loginButtonText}>Hızlı Giriş Yap</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

// --- Stil Tanımlamaları ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryBlack, // Arka plan siyah yapıldı
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary, // Metin rengi beyaz yapıldı
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary, // Metin rengi gri yapıldı
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textPrimary, // Metin rengi beyaz yapıldı
    marginBottom: 4,
  },
  loginPrompt: {
    marginTop: 10,
    alignItems: 'center', // İçeriği (buton vs.) ortalamak için
  },
  loginPromptText: {
    fontSize: 13,
    color: COLORS.textSecondary, // Metin rengi gri yapıldı
    textAlign: 'center',
    marginBottom: 15, // Butonla arasına boşluk koymak için
  },
  // --- YENİ BUTON STİLLERİ ---
  loginButton: {
    backgroundColor: COLORS.primaryYellow, // Arka plan sarı yapıldı
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Yuvarlak kenarlı buton
    shadowColor: COLORS.primaryYellow, // Butona hafif bir ışıma efekti
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonText: {
    color: COLORS.primaryBlack, // Buton metni siyah yapıldı
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventCard;