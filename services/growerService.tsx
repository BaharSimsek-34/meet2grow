// Tanımladığımız modeli import ediyoruz.
import { Grower } from '../models/models';

// Bu fonksiyon, Grower tipinde bir nesne dizisi döndürür.
function getAllGrowers(): Grower[] {
  // Örnek veri
  const growers: Grower[] = [
    {
      name: 'Ayşe',
      surname: 'Yılmaz',
      graduatedSchool: 'Boğaziçi Üniversitesi', // camelCase ile erişim daha kolay
      graduatedYear: 2020,
      major: 'Bilgisayar Mühendisliği',
      isAngel: false
    },
    {
      name: 'Ahmet',
      surname: 'Kaya',
      graduatedSchool: 'ODTÜ',
      graduatedYear: 2018,
      major: 'İşletme',
      info: 'Seri yatırımcı ve mentor.',
      isAngel: true
    }
  ];
  
  return growers;
}

// Bir Grower nesnesi oluşturma
const newGrower: Grower = {
    name: "Zeynep",
    surname: "Demir",
    graduatedSchool: "İTÜ",
    graduatedYear: 2022,
    major: "Endüstri Mühendisliği",
    isAngel: false
};

console.log(newGrower.name); // Çıktı: Zeynep
console.log(newGrower.graduatedSchool); // Çıktı: İTÜ