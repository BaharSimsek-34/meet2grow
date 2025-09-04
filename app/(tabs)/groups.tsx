// src/screens/GroupListScreen.tsx
import React, { useEffect, useState } from 'react';
import {SafeAreaView, FlatList, StyleSheet, Text, View } from 'react-native';
import {Group } from '../../models/models';
import {getAllGroups} from '../../services/groupService';
import GroupCard from '../../components/GroupCard';

const GroupListScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Bileşen yüklendiğinde servis fonksiyonundan verileri çek
    const fetchedGroups = getAllGroups();
    setGroups(fetchedGroups);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gruplar</Text>
      </View>
      <FlatList
        data={groups}
        renderItem={({ item }) => <GroupCard group={item} />}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        numColumns={2} // Her sırada 2 öğe göster
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 8, // Kartların kenar boşluklarıyla uyumlu olması için
    paddingTop: 8,
  },
});

export default GroupListScreen;