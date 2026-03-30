import { Icon } from '@tabler/icons-react-native';
import { Dayjs } from 'dayjs';
import { Href } from 'expo-router';
import { ImageSourcePropType } from 'react-native';

export type Language = {
  lang: string;
  name: string;
};

export type SettingsLink = {
  icon?: Icon;
  label: string;
  route?: string;
  rightText?: string;
  notification?: boolean;
  color?: string;
  onPress?: () => void;
};

export type OnboardingItem = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export type VirtualConsultationItem = {
  title: string;
  image: ImageSourcePropType;
  price: string;
};

export type SpecialistItem = {
  title: string;
  desc: string;
  image: ImageSourcePropType;
  price: string;
};

export type Product = {
  title: string;
  slug: string;
  image: ImageSourcePropType;
  images: ImageSourcePropType[];
  price: string;
  date: string;
  type: string;
  by: string;
  inStock: boolean;
  freeDelivery: boolean;
  overview: string;
  description: string;
  benefits: string[];
  reviews: {
    average: number;
    total: number;
    distribution: { stars: number; count: number }[];
    highlights: string[];
    comments: { name: string; date: string; rating: number; comment: string; verified: boolean }[];
  };
};

export type CarouselItem = {
  image: ImageSourcePropType;
};

export type Doctor = {
  id: number;
  name: string;
  role: string;
  clinic: string;
  earliestSlot: Dayjs;
  lastSlot: Dayjs;
  image: ImageSourcePropType;
  rating: number;
  experience: string;
  favorite: boolean;
  details: string;
  gender: 'Male' | 'Female';
  price: number;
  status?: 'upcoming' | 'completed' | 'cancelled';
};

export type CountrySelectItem = {
  label: string;
  value: string;
};

export type RelationshipItem = {
  label: string;
  value: string;
};

export type HealthPlanItem = {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: ImageSourcePropType;
};

export type ServiceItem = {
  id: number;
  image: ImageSourcePropType;
  name: string;
  route: Href | boolean;
};

export type QuickActionItem = {
  icon: Icon;
  label: string;
  route?: string;
  onPress?: () => void;
};

export type ProfileSettingItem = {
  icon: Icon;
  label: string;
  route?: string;
  onPress?: () => void;
  color?: string;
};
