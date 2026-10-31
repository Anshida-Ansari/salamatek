export interface CustomContactField {
  key: string;
  labelEn: string;
  labelAr: string;
  value: string;
  type?: 'phone' | 'email' | 'url' | 'text';
}

export interface ContactSettings {
  phone: string;
  emergencyPhone?: string;
  additionalPhones: string[];
  whatsappNumber: string;
  whatsappDisplay?: string;
  opticalsPhone?: string;
  opticalsShortLocation?: string;
  opticalsMapUrl?: string;
  email: string;
  additionalEmails?: string[];
  address: string;
  addressAr?: string;
  shortLocation?: string;
  shortLocationAr?: string;
  mapsLink: string;
  mapsEmbedUrl?: string;
  workingHoursEn?: string;
  workingHoursAr?: string;
  social: {
    facebook?: string;
    instagram?: string;
    snapchat?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  customFields?: CustomContactField[];
}

export const contactConfig: ContactSettings = {
  email: 'info@salamatekgroup.com',
  address: 'Belal Ibn Rabah St, Safa Area، Safwa 32833, Saudi Arabia',
  addressAr: 'شارع بلال بن رباح، حي الصفا، صفوى 32833، المملكة العربية السعودية',
  shortLocation: 'Safwa',
  shortLocationAr: 'صفوى',
  phone: '013 664 2193',
  emergencyPhone: '+966 53 296 3521',
  additionalPhones: [
    '+966 53 296 3521',
    '+966 55 740 0450',
    '+966 55 350 4004',
  ],
  whatsappNumber: '966532963521',
  whatsappDisplay: '+966 53 296 3521',
  opticalsPhone: '+966 55 929 3222',
  opticalsShortLocation: 'Safwa',
  opticalsMapUrl: 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw',
  mapsLink: 'https://maps.app.goo.gl/ExsLAhHJm1mrgrnj7?g_st=ac',
  workingHoursEn: '24/7 Emergency Service',
  workingHoursAr: 'خدمة الطوارئ 24/7',
  social: {
    facebook: '#',
    instagram: 'https://www.instagram.com/salamatek_medical?obrf=MXM0c2I0NHUxenVpbQ%3D%3D&utm_source=qr',
    snapchat: 'https://www.snapchat.com/add/salamatekmed',
    linkedin: '#',
    youtube: '#',
    tiktok: '#',
    twitter: '#',
  },
  customFields: [],
};
