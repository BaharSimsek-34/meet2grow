export interface Grower {
  //id:string;
    name: string;
    surname: string;
    graduatedSchool: string; // "graduated school" yerine
    graduatedYear: number;   // "graduated year" yerine
    major: string;
    info?: string;
    isAngel: boolean;
    profilePictureUrl?: string;
  }


// src/models/Group.js

export interface Group {
name:string;
description:string;
type:'private'|'public'; 
}

export interface CoorparateGrower {
  //id:string;
  firmName:string,
  webSite:string,
  explanation:string,
  logoUrl:string
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  // Katılımcıları basitlik adına string dizisi olarak tutalım.
  // Gerçek bir uygulamada bu bir User nesne dizisi olabilir.
  participants: string[];
  imageUrl?: string; // Etkinlik resmi (opsiyonel)
  isPrivate: boolean; // Etkinliğin özel bir gruba ait olup olmadığını belirtir
}



