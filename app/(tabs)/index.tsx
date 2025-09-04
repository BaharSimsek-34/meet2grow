import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Button, View, Text } from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../models/models';

// Örnek veri (Normalde bu veriler bir API'den gelir)
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Yapay Zeka ve Gelecek Paneli',
    date: new Date('2025-09-15T19:00:00'),
    location: 'Teknoloji Merkezi, Konferans Salonu',
    participants: ['Ali Veli', 'Ayşe Fatma', 'Mehmet Yılmaz'],
    imageUrl: 'https://images.unsplash.com/photo-1519452575417-5e0444212def?q=80&w=2070&auto=format&fit=crop',
    isPrivate: false,
  },
  {
    id: '2',
    title: '30+ Bekarlar Grubu Tanışma Yemeği',
    date: new Date('2025-09-20T20:00:00'),
    location: 'Marina Restoran, Sahil Yolu',
    participants: ['Can Demir', 'Elif Su', 'Zeynep Kaya', 'Barış Çelik'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    isPrivate: true,
  },
  {
    id: '3',
    title: 'Cilt Bakımı Atölyesi',
    date: new Date('2025-10-01T14:00:00'),
    location: 'Güzellik Akademisi',
    participants: ['Selin Işık', 'Merve Güneş'],
    imageUrl: 'https://images.unsplash.com/photo-1590782749572-c63703d2114d?q=80&w=1925&auto=format&fit=crop',
    isPrivate: false,
  },
];

const EventListScreen = () => {
  // Kullanıcının giriş durumunu simüle etmek için bir state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEventPress = (event: Event) => {
    // Giriş yapmışsa etkinlik detay sayfasına yönlendir
    // Giriş yapmamışsa giriş/kayıt ekranına yönlendir
    if (isLoggedIn) {
      alert(`'${event.title}' etkinliğinin detaylarına gidiliyor...`);
    } else {
      alert('Lütfen bu etkinliğin detaylarını görmek için giriş yapın.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yaklaşan Etkinlikler</Text>
        <Button
          title={isLoggedIn ? 'Çıkış Yap' : 'Giriş Yap'}
          onPress={() => setIsLoggedIn(prev => !prev)}
        />
      </View>

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isLoggedIn={isLoggedIn}
            onPress={() => handleEventPress(item)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 10,
  },
});

export default EventListScreen;