import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  Platform, // Platform'u hala kullanıyoruz
} from 'react-native';
// --- DEĞİŞİKLİK 1: Expo kütüphanelerini import et ---
import * as Location from 'expo-location'; // react-native-permissions ve react-native-geolocation-service yerine bu kullanılır
import { FontAwesome5 } from '@expo/vector-icons'; // react-native-vector-icons yerine bu kullanılır

// --- VERİ MODELLERİ (Aynı kalıyor) ---
export interface Group {
 title: string;
 picture: string;
 description: string;
 memberCount: number;
 memberIds: string[];
 type:'private'|'public';
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  participants: string[];
  imageUrl?: string;
  isPrivate: boolean;
}

interface NearbyGroupResult {
  groupInfo: Group & { id: string };
  nearbyGrowerCount: number;
  isCurrentUserMember: boolean;
  distance: number;
}

type NearbyEvent = Event & {
  distance: number;
};

type ActiveTab = 'growers' | 'events';
type DistanceFilter = 1 | 5 | 15;


// --- SAHTE API ÇAĞRISI (Aynı kalıyor) ---
const mockApiCall = async (
  tab: ActiveTab,
  distance: DistanceFilter,
  userLocation: { latitude: number; longitude: number }
): Promise<{ groups?: NearbyGroupResult[]; events?: NearbyEvent[] }> => {
  console.log(`API çağrısı: ${tab} için ${distance}km mesafe içinde. Konum:`, userLocation);
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (tab === 'growers') {
    const allGroups: NearbyGroupResult[] = [
      {
        groupInfo: { id: 'g1', title: 'Toprak Dostları', picture: 'url1', description: '', memberCount: 80, memberIds: [], type: 'public' },
        nearbyGrowerCount: 8, isCurrentUserMember: true, distance: 0.8
      },
      {
        groupInfo: { id: 'g2', title: 'Çatı Katı Bahçıvanları', picture: 'url2', description: '', memberCount: 150, memberIds: [], type: 'public' },
        nearbyGrowerCount: 5, isCurrentUserMember: false, distance: 4.5
      },
      {
        groupInfo: { id: 'g3', title: 'Kadıköy Bostanı', picture: 'url3', description: '', memberCount: 45, memberIds: [], type: 'private' },
        nearbyGrowerCount: 12, isCurrentUserMember: true, distance: 6.2
      },
      {
        groupInfo: { id: 'g4', title: 'Organik Pazar Grubu', picture: 'url4', description: '', memberCount: 200, memberIds: [], type: 'public' },
        nearbyGrowerCount: 2, isCurrentUserMember: false, distance: 12.1
      },
      {
        groupInfo: { id: 'g5', title: 'Balkon Tarımı Derneği', picture: 'url5', description: '', memberCount: 30, memberIds: [], type: 'public' },
        nearbyGrowerCount: 15, isCurrentUserMember: false, distance: 0.5
      },
    ];

    const filtered = allGroups.filter(g => g.distance <= distance);
    filtered.sort((a, b) => {
      if (a.isCurrentUserMember && !b.isCurrentUserMember) return -1;
      if (!a.isCurrentUserMember && b.isCurrentUserMember) return 1;
      return a.distance - b.distance;
    });
    return { groups: filtered };

  } else {
    const allEvents: NearbyEvent[] = [
      { id: 'e1', title: 'Tohum Takas Şenliği', date: new Date(), location: 'Yoğurtçu Parkı', participants: [], isPrivate: false, distance: 0.7 },
      { id: 'e2', title: 'Kompost Atölyesi', date: new Date(), location: 'Beşiktaş', participants: [], isPrivate: false, distance: 4.8 },
      { id: 'e3', title: 'Fide Dikim Günü', date: new Date(), location: 'Moda Sahili', participants: [], isPrivate: true, distance: 6.5 },
    ];
    const today = new Date();
    today.setHours(0,0,0,0);
    return { events: allEvents.filter(e => e.distance <= distance && e.date >= today) };
  }
};


// --- ANA COMPONENT ---
const NearbyScreen = () => {
  // isLoading'un başlangıç değerini true yapalım ki ilk başta izin isteği sırasında yükleniyor görünsün
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('growers');
  const [selectedDistance, setSelectedDistance] = useState<DistanceFilter | null>(null);
  const [nearbyGroups, setNearbyGroups] = useState<NearbyGroupResult[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<NearbyEvent[]>([]);

  // --- DEĞİŞİKLİK 2: Konum izni ve konum alma mantığını birleştir ---
  useEffect(() => {
    const getLocation = async () => {
      // 1. İzin iste
      let { status } = await Location.requestForegroundPermissionsAsync();

      // 2. İzin verilmediyse durumu güncelle ve uyar
      if (status !== 'granted') {
        Alert.alert(
          "Konum İzni Gerekli",
          "Yakınınızdakileri görmek için uygulama ayarlarından konum iznini etkinleştirmeniz gerekmektedir.",
          [
              { text: "Ayarlara Git", onPress: () => Linking.openSettings() },
              { text: "İptal", style: "cancel" }
          ]
        );
        setHasPermission(false);
        setIsLoading(false);
        return; // Fonksiyondan çık
      }

      // 3. İzin verildiyse durumu güncelle ve konumu al
      setHasPermission(true);
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
         Alert.alert("Konum Hatası", "Konumunuz alınamadı. Lütfen GPS ayarlarınızı kontrol edin.");
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, []); // Bu useEffect sadece component ilk yüklendiğinde bir kez çalışır

  // Veri çekme (Bu kısım büyük ölçüde aynı kalıyor)
  useEffect(() => {
    if (location && selectedDistance) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await mockApiCall(activeTab, selectedDistance, location);
          if (activeTab === 'growers' && response.groups) {
            setNearbyGroups(response.groups);
          } else if (activeTab === 'events' && response.events) {
            setNearbyEvents(response.events);
          }
        } catch (err) {
          Alert.alert("Hata", "Veriler alınırken bir sorun oluştu.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [activeTab, selectedDistance, location]);


  const renderPermissionRequest = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.infoText}>Yakınınızdaki grower ve etkinlikleri görmek için konum izni vermelisiniz.</Text>
      {/* Bu butonu tekrar izin istemesi için yeniden düzenleyebiliriz ama Linking.openSettings daha kullanıcı dostu */}
      <TouchableOpacity style={styles.permissionButton} onPress={() => Linking.openSettings()}>
        <Text style={styles.permissionButtonText}>Ayarları Aç</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGroupItem = ({ item }: { item: NearbyGroupResult }) => (
    <View style={[styles.card, item.isCurrentUserMember && styles.memberCard]}>
      {/* --- DEĞİŞİKLİK 3: Icon component'ini FontAwesome5 olarak değiştir --- */}
      <FontAwesome5 name="users" size={24} color={item.isCurrentUserMember ? '#16a085' : '#2c3e50'} />
      <View style={styles.cardContent}>
        <Text style={styles.groupName}>{item.groupInfo.title}</Text>
        <Text style={styles.growerCount}>{item.nearbyGrowerCount} grower bulundu</Text>
      </View>
    </View>
  );

  const renderEventItem = ({ item }: { item: NearbyEvent }) => (
     <View style={styles.card}>
      {/* --- DEĞİŞİKLİK 4: Icon component'ini FontAwesome5 olarak değiştir --- */}
      <FontAwesome5 name="calendar-check" size={24} color="#8e44ad" />
      <View style={styles.cardContent}>
        <Text style={styles.groupName}>{item.title}</Text>
        <Text style={styles.growerCount}>{item.location}</Text>
      </View>
    </View>
  );

  const renderContent = () => (
    <>
      {/* Tab ve Filtreler (Aynı kalıyor) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'growers' && styles.tabActive]} onPress={() => setActiveTab('growers')}>
          <Text style={[styles.tabText, activeTab === 'growers' && styles.tabActiveText]}>Growerlar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'events' && styles.tabActive]} onPress={() => setActiveTab('events')}>
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabActiveText]}>Etkinlikler</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, selectedDistance === 1 && styles.filterActive]} onPress={() => setSelectedDistance(1)}>
            <Text style={[styles.filterText, selectedDistance === 1 && styles.filterActiveText]}>Yürüme Mesafesi</Text>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.filterButton, selectedDistance === 5 && styles.filterActive]} onPress={() => setSelectedDistance(5)}>
            <Text style={[styles.filterText, selectedDistance === 5 && styles.filterActiveText]}>Yakın Mesafe</Text>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.filterButton, selectedDistance === 15 && styles.filterActive]} onPress={() => setSelectedDistance(15)}>
            <Text style={[styles.filterText, selectedDistance === 15 && styles.filterActiveText]}>İlçe</Text>
        </TouchableOpacity>
      </View>

      {/* Listeleme (Aynı kalıyor) */}
      {selectedDistance ? (
        isLoading ? (
          <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 50 }} />
        ) : activeTab === 'growers' ? (
          <FlatList
            data={nearbyGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.groupInfo.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.centerContainer}>
                <Text style={styles.infoText}>Bu mesafede sonuç bulunamadı.</Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={nearbyEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.centerContainer}>
                <Text style={styles.infoText}>Bu mesafede sonuç bulunamadı.</Text>
              </View>
            )}
          />
        )
      ) : (
        <View style={styles.centerContainer}>
            <Text style={styles.infoText}>Sonuçları görmek için bir mesafe filtresi seçin.</Text>
        </View>
      )}
    </>
  );

  // Başlangıçta yükleniyor ekranını göster
  if (isLoading && !location) {
    return <ActivityIndicator size="large" color="#27ae60" style={styles.centerContainer} />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {!hasPermission ? renderPermissionRequest() : renderContent()}
    </SafeAreaView>
  );
};


// --- STİLLER (Aynı kalıyor) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7f8c8d',
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#ecf0f1',
        borderRadius: 25,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {
        backgroundColor: '#27ae60',
    },
    tabText: {
        color: '#2c3e50',
        fontWeight: '600',
    },
    tabActiveText: {
        color: '#fff',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    filterButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12, // Adjusted for smaller screens
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#bdc3c7',
    },
    filterActive: {
        backgroundColor: '#34495e',
        borderColor: '#34495e',
    },
    filterText: {
        color: '#34495e',
        fontSize: 13, // Adjusted for smaller screens
    },
    filterActiveText: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    memberCard: {
        borderLeftWidth: 5,
        borderLeftColor: '#1abc9c',
        backgroundColor: '#f8fdfc'
    },
    cardContent: {
        marginLeft: 16,
        flex: 1,
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    growerCount: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
});

export default NearbyScreen;