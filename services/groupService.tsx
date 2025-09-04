// src/services/groupService.ts
import { Group } from '../models/models'; // Tip tanımını import ediyoruz

export function getAllGroups(): Group[] {
  // Örnek veri (eksik alanlar tamamlandı)
  const groups: Group[] = [
    {
      title: "Bekarlar Grubu",
      description: "Bu Grup 30 yaşın üzeri bekar üniversite mezunlarına özel bir gruptur. Grup dating amacıyla kurulmamıştır. İyi vakit geçirmek içindir.",
      type: 'private',
      picture: 'https://picsum.photos/200?random=1', // Örnek resim
      memberCount: 150,
      memberIds: ['1', '2', '3'],
    },
    {
      title: "Yazılım & Yapay Zeka",
      description: "Yazılım, yapay zeka, bilim ve teknoloji üzerine tartışmalar.",
      type: 'public',
      picture: 'https://picsum.photos/200?random=2',
      memberCount: 2500,
      memberIds: ['4', '5'],
    },
    {
      title: "Teknoloji Grupları",
      description: "En son teknolojik gelişmeler ve haberler.",
      type: 'public',
      picture: 'https://picsum.photos/200?random=3',
      memberCount: 500,
      memberIds: ['6', '7'],
    },
    {
      title: "Ekonomi Grubu",
      description: "Güncel ekonomik gelişmeler ve yatırım stratejileri.",
      type: 'public',
      picture: 'https://picsum.photos/200?random=4',
      memberCount: 1200,
      memberIds: ['8'],
    },
    {
      title: "Cilt Bakımı Grubu",
      description: "Cilt bakımı rutinleri, ürün önerileri ve daha fazlası.",
      type: 'public',
      picture: 'https://picsum.photos/200?random=5',
      memberCount: 850,
      memberIds: ['9', '10'],
    },
  ];

  return groups;
}