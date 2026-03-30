import images from '@/data/images';
import {
  CarouselItem,
  CountrySelectItem,
  Doctor,
  HealthPlanItem,
  Language,
  OnboardingItem,
  Product,
  ProfileSettingItem,
  QuickActionItem,
  RelationshipItem,
  ServiceItem,
  SettingsLink,
  SpecialistItem,
  VirtualConsultationItem,
} from '@/types/common';
import dayjs from 'dayjs';

import {
  IconAlarm,
  IconBrightness,
  IconCalendarDot,
  IconCarouselHorizontal,
  IconClearAll,
  IconCreditCard,
  IconHelp,
  IconLock,
  IconLogout,
  IconMedicalCrossCircle,
  IconMessage2,
  IconPhone,
  IconScale,
  IconSmartHome,
  IconTrash,
  IconUser,
  IconUsers,
  IconVideo,
  IconWifi,
  IconWorld,
} from '@tabler/icons-react-native';

export const APP_VERSION: string = '1.2.0';

export const languages: Language[] = [
  { lang: 'en-US', name: 'English' },
  { lang: 'en-ID', name: 'Indonesian' },
  { lang: 'en-JP', name: 'Japanese' },
];

export const onboardingData: OnboardingItem[] = [
  {
    title: 'onboarding_title_1',
    description: 'onboarding_description_1',
    image: images.one,
  },
  {
    title: 'onboarding_title_2',
    description: 'onboarding_description_2',
    image: images.two,
  },
  {
    title: 'onboarding_title_3',
    description: 'onboarding_description_3',
    image: images.three,
  },
];

export const virtualConsultationData: VirtualConsultationItem[] = [
  {
    title: 'doctor',
    image: images.doctor,
    price: '$45',
  },
  {
    title: 'specialist',
    image: images.specialist,
    price: '$90',
  },
  {
    title: 'mental_health',
    image: images.mentalHealth,
    price: '$160',
  },
  {
    title: 'nutrition_and_fitness',
    image: images.nutritionAndFitness,
    price: '$160',
  },
  {
    title: 'lactose_consultant',
    image: images.lactoseConsultant,
    price: '$140',
  },
  {
    title: 'children_clinic',
    image: images.childrenClinic,
    price: '$46',
  },
];

export const specialistsData: SpecialistItem[] = [
  {
    title: 'cardiology',
    desc: 'cardiology_treatment',
    image: images.heart,
    price: '$90',
  },
  {
    title: 'colon',
    desc: 'colon_treatment',
    image: images.colon,
    price: '$120',
  },
  {
    title: 'dermatology',
    desc: 'dermatology_treatment',
    image: images.dermatology,
    price: '$160',
  },
  {
    title: 'gastroenterology',
    desc: 'gastroenterology_treatment',
    image: images.stomach,
    price: '$160',
  },
  {
    title: 'nephrology',
    desc: 'nephrology_treatment',
    image: images.kidney,
    price: '$130',
  },
  {
    title: 'orthopedics',
    desc: 'orthopedics_treatment',
    image: images.orthopaedics,
    price: '$130',
  },
];

export const productsData: Product[] = [
  {
    title: 'Rheuma-Salve® Pain Relief Balm (50g) 特强止痛膏',
    slug: 'rheuma-salve-pain-relief-balm-50g',
    image: images.rheumaSalve1,
    images: [images.rheumaSalve1, images.rheumaSalve2],
    price: '$20',
    date: '20-01-2025',
    type: 'otc',
    by: 'HST Medical Pte Ltd',
    inStock: true,
    freeDelivery: true,
    overview:
      'A powerful pain relief balm formulated with natural ingredients for effective relief of muscle aches and joint pains. Suitable for daily use with fast-acting formula.',
    description:
      'Made with premium grade ingredients, this balm provides quick relief for muscular aches, joint pains, and arthritis. Features a non-greasy formula that absorbs quickly into the skin.',
    benefits: [
      'Provides quick relief from muscle aches and joint pains',
      'Non-greasy formula absorbs quickly',
      'Natural ingredients for safe daily use',
      'Promotes better blood circulation',
      'Suitable for massage application',
    ],
    reviews: {
      average: 4.8,
      total: 641,
      distribution: [
        { stars: 5, count: 550 },
        { stars: 4, count: 70 },
        { stars: 3, count: 15 },
        { stars: 2, count: 4 },
        { stars: 1, count: 2 },
      ],
      highlights: ['Benefits', 'Great Value', 'Reliability'],
      comments: [
        {
          name: 'Sarah Chen',
          date: 'January 2024',
          rating: 5,
          comment:
            'This pain relief balm works wonders for my joint pain. Fast-acting and non-greasy formula. Will definitely purchase again!',
          verified: true,
        },
        {
          name: 'Michael Tan',
          date: 'December 2023',
          rating: 4,
          comment:
            'Very effective for muscle aches after workouts. The natural ingredients are a plus. Just wish the container was slightly bigger.',
          verified: true,
        },
      ],
    },
  },
  {
    title: 'Bio Essence Bio Ageluxe Retinoid A Pro-Intensive Eye Serum 15G',
    slug: 'bio-essence-bio-ageluxe-retinoid-a-pro-intensive-eye-serum-15g',
    image: images.bioEssenceBioAgeluxe1,
    images: [
      images.bioEssenceBioAgeluxe1,
      images.bioEssenceBioAgeluxe2,
      images.bioEssenceBioAgeluxe3,
    ],
    price: '$35',
    date: '21-01-2025',
    type: 'health-wellness',
    by: 'Bio Essence International',
    inStock: true,
    freeDelivery: true,
    overview:
      'Advanced anti-aging eye serum with Retinoid A complex for reducing fine lines and dark circles. Clinically proven formula for visible results.',
    description:
      'Professional-grade eye serum that combines Retinoid A with peptides and natural extracts. Helps reduce signs of aging around the delicate eye area while providing intense hydration.',
    benefits: [
      'Reduces appearance of fine lines and wrinkles',
      'Diminishes dark circles and puffiness',
      'Provides intense hydration to eye area',
      'Improves skin elasticity',
      'Contains protective antioxidants',
    ],
    reviews: {
      average: 4.9,
      total: 1242,
      distribution: [
        { stars: 5, count: 1130 },
        { stars: 4, count: 95 },
        { stars: 3, count: 12 },
        { stars: 2, count: 3 },
        { stars: 1, count: 2 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: 'Blackmores Evening Primrose Oil 1000mg 60 Capsule',
    slug: 'blackmores-evening-primrose-oil-1000mg-60-capsule',
    image: images.blackmoresEveningPrimrose1,
    images: [images.blackmoresEveningPrimrose1, images.blackmoresEveningPrimrose2],
    price: '$21',
    date: '22-01-2025',
    type: 'health-wellness',
    by: 'Blackmores Ltd',
    inStock: false,
    freeDelivery: true,
    overview:
      "High-quality evening primrose oil supplement rich in essential fatty acids. Supports women's health and skin maintenance.",
    description:
      'Each capsule contains pure evening primrose oil, providing gamma-linolenic acid (GLA) and other essential fatty acids. Helps maintain hormonal balance and skin health.',
    benefits: [
      "Supports women's hormonal balance",
      'Promotes healthy skin condition',
      'Helps maintain joint mobility',
      'Supports cardiovascular health',
      'Rich in essential fatty acids',
    ],
    reviews: {
      average: 4.5,
      total: 283,
      distribution: [
        { stars: 5, count: 180 },
        { stars: 4, count: 75 },
        { stars: 3, count: 20 },
        { stars: 2, count: 10 },
        { stars: 1, count: 4 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: "Durex Fetherlite Condom 12's",
    slug: 'durex-fetherlite-condom-12s',
    image: images.durexFeatherliteCondom1,
    images: [images.durexFeatherliteCondom1, images.durexFeatherliteCondom2],
    price: '$13',
    date: '23-01-2025',
    type: 'health-wellness',
    by: 'Reckitt Benckiser Healthcare',
    inStock: true,
    freeDelivery: false,
    overview:
      'Ultra-thin condoms for enhanced sensitivity while maintaining high reliability. Dermatologically tested for safety.',
    description:
      'Premium quality condoms featuring ultra-thin technology for natural feeling. Each condom is electronically tested for reliability and safety.',
    benefits: [
      'Ultra-thin for enhanced sensitivity',
      'Electronically tested for reliability',
      'Dermatologically tested',
      'Easy to use design',
      'Secure and comfortable fit',
    ],
    reviews: {
      average: 5,
      total: 4853,
      distribution: [
        { stars: 5, count: 4600 },
        { stars: 4, count: 230 },
        { stars: 3, count: 15 },
        { stars: 2, count: 5 },
        { stars: 1, count: 3 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: 'Oxy Acne Patch 26S',
    slug: 'oxy-acne-patch-26s',
    image: images.oxyAcnePatch1,
    images: [images.oxyAcnePatch1, images.oxyAcnePatch2, images.oxyAcnePatch3],
    price: '$3',
    date: '24-01-2025',
    type: 'otc',
    by: 'Mentholatum Singapore Pte Ltd',
    inStock: true,
    freeDelivery: false,
    overview:
      'Invisible acne patches that effectively treat pimples overnight. Contains advanced healing ingredients.',
    description:
      'Ultra-thin hydrocolloid patches that absorb pimple secretions while protecting the affected area. Helps reduce inflammation and promotes faster healing.',
    benefits: [
      'Effectively treats pimples overnight',
      'Invisible on skin application',
      'Protects affected area from external factors',
      'Reduces inflammation and redness',
      'Promotes faster healing',
    ],
    reviews: {
      average: 4.2,
      total: 3791,
      distribution: [
        { stars: 5, count: 1890 },
        { stars: 4, count: 1230 },
        { stars: 3, count: 460 },
        { stars: 2, count: 161 },
        { stars: 1, count: 50 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: 'PANADOL Actifast Paracetamol Pain Relief 500mg 100S Fast Relief',
    slug: 'panadol-actifast-paracetamol-pain-relief-500mg-100s-fast-relief',
    image: images.panadolActifastParacetamol1,
    images: [
      images.panadolActifastParacetamol1,
      images.panadolActifastParacetamol2,
      images.panadolActifastParacetamol3,
    ],
    price: '$29',
    date: '25-01-2025',
    type: 'otc',
    by: 'GlaxoSmithKline',
    inStock: true,
    freeDelivery: true,
    overview:
      'Fast-acting paracetamol tablets for quick pain relief. Specially formulated for rapid absorption.',
    description:
      'Each tablet contains 500mg of paracetamol in an advanced formulation that dissolves quickly. Provides effective relief from headaches, muscle aches, and fever.',
    benefits: [
      'Fast-acting pain relief',
      'Effectively reduces fever',
      'Easy to swallow tablets',
      'Suitable for various types of pain',
      'Begins to work in 15 minutes',
    ],
    reviews: {
      average: 4.9,
      total: 7131,
      distribution: [
        { stars: 5, count: 6500 },
        { stars: 4, count: 550 },
        { stars: 3, count: 60 },
        { stars: 2, count: 15 },
        { stars: 1, count: 6 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: "Hurix's Tongkat Ali Plus 30s",
    slug: 'hurix-s-tongkat-ali-plus-30s',
    image: images.tongkatAli1,
    images: [images.tongkatAli1, images.tongkatAli2],
    price: '$9',
    date: '26-01-2025',
    type: 'health-wellness',
    by: 'Hurix Healthcare Sdn Bhd',
    inStock: false,
    freeDelivery: false,
    overview:
      'Premium Tongkat Ali supplement enhanced with additional herbs for male vitality. Traditional herb meets modern science.',
    description:
      'Standardized extract of Tongkat Ali combined with other beneficial herbs. Supports male health and energy levels naturally.',
    benefits: [
      'Supports male vitality and energy',
      'Enhances physical performance',
      'Made from traditional herbs',
      'Helps maintain hormonal balance',
      'Natural supplement formulation',
    ],
    reviews: {
      average: 3.8,
      total: 592,
      distribution: [
        { stars: 5, count: 180 },
        { stars: 4, count: 240 },
        { stars: 3, count: 120 },
        { stars: 2, count: 40 },
        { stars: 1, count: 12 },
      ],
      highlights: [],
      comments: [],
    },
  },
  {
    title: 'Bio-essence Bio-Water Foamy Cleanser (100g)',
    slug: 'bio-essence-bio-water-foamy-cleanser-100g',
    image: images.bioEssenceBioWater1,
    images: [images.bioEssenceBioWater1, images.bioEssenceBioWater2],
    price: '$15',
    date: '27-01-2025',
    type: 'health-wellness',
    by: 'Bio Essence International',
    inStock: true,
    freeDelivery: true,
    overview:
      "Bio Energy Complex™ is our proprietary formula that boosts the skin's ability to repair, renew and replenish itself",
    description:
      'By enhancing the in-take of oxygen, it helps the skin breathe, transforming it into active and energized state. This dramatically increases the efficacy of our skin-soothing bio-ingredient - Bio-Water for a calm soothed skin.',
    benefits: [
      'Help cool down skin temperature, leaving your skin hydrated, refreshed and calm',
      'Fine foams to thoroughly cleanse oil impurities and dirt for a shine-free and noticeably fresh skin',
      'Keeps skin fresh and hydrated',
    ],
    reviews: {
      average: 5.0,
      total: 1230,
      distribution: [
        { stars: 5, count: 615 },
        { stars: 4, count: 369 },
        { stars: 3, count: 160 },
        { stars: 2, count: 55 },
        { stars: 1, count: 31 },
      ],
      highlights: [],
      comments: [],
    },
  },
];

export const highlightData: CarouselItem[] = [
  {
    image: images.carousel1,
  },
  {
    image: images.carousel2,
  },
];

export const discoverData: CarouselItem[] = [
  {
    image: images.carousel3,
  },
  {
    image: images.carousel4,
  },
];

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr Sarah Chen',
    gender: 'Female',
    role: 'general_practitioner',
    clinic: 'HealthFirst Clinic @ Tampines',
    earliestSlot: dayjs().hour(9).minute(15),
    lastSlot: dayjs().hour(15).minute(15),
    image: images.doctor1,
    rating: 4.8,
    experience: '15 years',
    favorite: false,
    details:
      "Dr. Chen specializes in preventive medicine and chronic disease management. With extensive training from prestigious medical institutions, she takes a holistic approach to healthcare, focusing on both physical and mental well-being. She has particular expertise in women's health, diabetes management, and geriatric care. Known for her gentle demeanor and thorough consultations, Dr. Chen ensures each patient receives personalized attention and comprehensive treatment plans. She regularly participates in medical research and keeps updated with the latest healthcare developments.",
    price: 120,
  },
  {
    id: 2,
    name: 'Dr Michael Wong',
    gender: 'Male',
    role: 'family_physician',
    clinic: 'FamilyCare @ Serangoon',
    earliestSlot: dayjs().hour(10).minute(30),
    lastSlot: dayjs().hour(18).minute(15),
    image: images.doctor2,
    rating: 4.9,
    experience: '12 years',
    favorite: false,
    details:
      'Dr. Wong is dedicated to providing comprehensive family healthcare services. His expertise spans across pediatric care, adult medicine, and elderly health management. He has special interest in sports medicine and lifestyle disease prevention. Known for his friendly approach and clear communication style, he excels at building long-term relationships with families under his care. Dr. Wong regularly conducts health workshops and is actively involved in community health programs. He believes in empowering patients through health education.',
    price: 110,
  },
  {
    id: 3,
    name: 'Dr Priya Sharma',
    gender: 'Female',
    role: 'general_practitioner',
    clinic: 'MediLife Clinic @ Jurong East',
    earliestSlot: dayjs().hour(11).minute(45),
    lastSlot: dayjs().hour(19).minute(15),
    image: images.doctor3,
    rating: 4.7,
    experience: '8 years',
    favorite: false,
    details:
      "Dr. Sharma brings a fresh perspective to general practice with her expertise in integrative medicine. She specializes in managing chronic conditions through lifestyle modifications and evidence-based treatments. Her approach combines modern medical practices with preventive care strategies. She has conducted research in metabolic disorders and is passionate about patient education. Dr. Sharma is known for her empathetic approach and takes time to understand each patient's unique health concerns.",
    price: 90,
  },
  {
    id: 4,
    name: 'Dr James Tan',
    gender: 'Male',
    role: 'family_physician',
    clinic: 'CityHealth @ Bishan',
    earliestSlot: dayjs().hour(14).minute(0),
    lastSlot: dayjs().hour(20).minute(15),
    image: images.doctor4,
    rating: 4.9,
    experience: '20 years',
    favorite: false,
    details:
      'Dr. Tan is a highly experienced physician with expertise in managing complex medical conditions. His two decades of practice have given him deep insights into family medicine and emergency care. He specializes in chronic disease management and preventive healthcare. Known for his calm demeanor and methodical approach, he has helped numerous families maintain optimal health through generations. Dr. Tan regularly updates his medical knowledge and incorporates the latest treatment protocols.',
    price: 130,
  },
  {
    id: 5,
    name: 'Dr Lisa Park',
    gender: 'Female',
    role: 'general_practitioner',
    clinic: 'WellCare @ Woodlands',
    earliestSlot: dayjs().hour(15).minute(30),
    lastSlot: dayjs().hour(21).minute(15),
    image: images.doctor5,
    rating: 4.6,
    experience: '10 years',
    favorite: false,
    details:
      "Dr. Park specializes in preventive medicine and women's health. Her approach focuses on early detection and lifestyle interventions for better health outcomes. She has additional training in mental health support and stress management. Known for her patient-centered approach, she ensures comprehensive care for all age groups. Dr. Park actively participates in medical conferences and stays updated with emerging healthcare technologies. She believes in building strong doctor-patient relationships for better health outcomes.",
    price: 100,
  },
  {
    id: 6,
    name: 'Dr Ahmad Hassan',
    gender: 'Male',
    role: 'family_physician',
    clinic: 'SunLife Medical @ Bedok',
    earliestSlot: dayjs().hour(16).minute(15),
    lastSlot: dayjs().hour(22).minute(15),
    image: images.doctor6,
    rating: 4.8,
    experience: '14 years',
    favorite: false,
    details:
      'Dr. Hassan excels in family medicine with a special focus on pediatric and elderly care. His expertise includes managing chronic conditions and providing preventive healthcare solutions. He has extensive experience in treating respiratory conditions and allergies. Known for his friendly demeanor and thorough approach, he takes time to explain medical conditions and treatment plans clearly. Dr. Hassan regularly conducts health screenings and vaccination programs in the community.',
    price: 115,
  },
  {
    id: 7,
    name: 'Dr Emily Zhang',
    gender: 'Female',
    role: 'general_practitioner',
    clinic: 'PrimeCare @ Yishun',
    earliestSlot: dayjs().hour(17).minute(0),
    lastSlot: dayjs().hour(23).minute(15),
    image: images.doctor7,
    rating: 4.7,
    experience: '9 years',
    favorite: false,
    details:
      'Dr. Zhang brings expertise in both general practice and emergency medicine. She specializes in acute care management and chronic disease prevention. Her approach emphasizes lifestyle modifications and preventive care. She has additional training in dermatology and minor surgical procedures. Known for her efficient yet caring approach, she ensures each patient receives personalized attention. Dr. Zhang regularly participates in medical outreach programs and community health initiatives.',
    price: 95,
  },
  {
    id: 8,
    name: 'Dr David Lee',
    gender: 'Male',
    role: 'family_physician',
    clinic: 'EastPoint Medical @ Pasir Ris',
    earliestSlot: dayjs().hour(9).minute(0),
    lastSlot: dayjs().hour(15).minute(15),
    image: images.doctor8,
    rating: 4.9,
    experience: '18 years',
    favorite: false,
    details:
      'Dr. Lee is renowned for his expertise in family medicine and geriatric care. His practice focuses on holistic healthcare delivery and preventive medicine. He has special interest in managing chronic conditions like diabetes and hypertension. Known for his patient and methodical approach, he ensures comprehensive care for all family members. Dr. Lee actively engages in continuing medical education and often shares his knowledge through community health talks.',
    price: 125,
  },
  {
    id: 9,
    name: 'Dr Anita Kapoor',
    gender: 'Female',
    role: 'general_practitioner',
    clinic: 'HealthHub @ Sengkang',
    earliestSlot: dayjs().hour(10).minute(30),
    lastSlot: dayjs().hour(17).minute(15),
    image: images.doctor9,
    rating: 4.8,
    experience: '11 years',
    favorite: false,
    details:
      "Dr. Kapoor combines modern medical practices with a holistic approach to healthcare. She specializes in women's health and family medicine, with additional expertise in mental health support. Her practice emphasizes preventive care and lifestyle management. Known for her empathetic nature and detailed consultations, she builds strong relationships with her patients. Dr. Kapoor regularly updates her medical knowledge through international conferences and workshops.",
    price: 105,
  },
  {
    id: 10,
    name: 'Dr Benjamin Koh',
    gender: 'Male',
    role: 'family_physician',
    clinic: 'WestMed @ Clementi',
    earliestSlot: dayjs().hour(19).minute(15),
    lastSlot: dayjs().hour(23).minute(15),
    image: images.doctor10,
    rating: 4.7,
    experience: '16 years',
    favorite: false,
    details:
      'Dr. Koh is experienced in managing various aspects of family medicine, from pediatric to geriatric care. He specializes in chronic disease management and preventive healthcare. His approach emphasizes patient education and lifestyle modifications. Known for his friendly demeanor and clear communication style, he ensures patients understand their health conditions thoroughly. Dr. Koh actively participates in medical research and keeps updated with the latest treatment protocols.',
    price: 120,
  },
];

export const countryData: CountrySelectItem[] = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Canada', value: 'CA' },
  { label: 'China', value: 'CN' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Japan', value: 'JP' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Norway', value: 'NO' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Russia', value: 'RU' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Singapore', value: 'SG' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Taiwan', value: 'TW' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Turkey', value: 'TR' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'Vietnam', value: 'VN' },
];

export const TERMS_AND_CONDITIONS: string =
  'https://www.termsfeed.com/blog/sample-terms-and-conditions-template/';

export const PRIVACY_POLICY: string =
  'https://www.termsfeed.com/blog/sample-privacy-policy-template/';

export const TERMS_OF_SERVICE: string =
  'https://www.termsfeed.com/blog/sample-terms-of-service-template/';

export const countryCodeData: CountrySelectItem[] = [
  { label: '+62', value: 'Indonesia' },
  { label: '+60', value: 'Malaysia' },
  { label: '+65', value: 'Singapore' },
];

export const getRelationshipData = (t: (key: string) => string): RelationshipItem[] => [
  { label: t('parent'), value: 'parent' },
  { label: t('spouse'), value: 'spouse' },
  { label: t('sibling'), value: 'sibling' },
  { label: t('children'), value: 'children' },
  { label: t('other'), value: 'other' },
];

export const healthPlanTypes: HealthPlanItem[] = [
  {
    name: 'healthwise_plus',
    slug: 'healthwise-plus',
    description: 'healthwise_plus_description',
    price: 'healthwise_plus_price',
    image: images.plus,
  },
  {
    name: 'healthwise_basic',
    slug: 'healthwise-basic',
    description: 'healthwise_basic_description',
    price: 'healthwise_basic_price',
    image: images.basic,
  },
];

export const services: ServiceItem[] = [
  {
    id: 1,
    image: images.consultation,
    name: 'virtual_consultation',
    route: '/book/doctor',
  },
  {
    id: 2,
    image: images.plus,
    name: 'health_plans',
    route: '/membership/overview',
  },
  {
    id: 3,
    image: images.otc,
    name: 'otc_medication',
    route: '/marketplace?type=otc',
  },
  {
    id: 4,
    image: images.helper,
    name: 'helper_6me_screening',
    route: false,
  },
  {
    id: 5,
    image: images.vaccination,
    name: 'vaccination',
    route: false,
  },
  {
    id: 6,
    image: images.screening,
    name: 'health_screening',
    route: false,
  },
  {
    id: 7,
    image: images.therapy,
    name: 'therapy',
    route: false,
  },
  {
    id: 8,
    image: images.dental,
    name: 'dental_services',
    route: false,
  },
  {
    id: 9,
    image: images.eye,
    name: 'eye_tests',
    route: false,
  },
  {
    id: 10,
    image: images.tcm,
    name: 'tcm_services',
    route: false,
  },
  {
    id: 11,
    image: images.breastfeed,
    name: 'postnatal_services',
    route: false,
  },
];

export const settingsData: SettingsLink[] = [
  {
    icon: IconWorld,
    label: 'languages',
    route: '/languages',
    rightText: 'lang',
    notification: true,
  },
  {
    icon: IconBrightness,
    label: 'toggle_theme',
    rightText: 'current_theme',
  },
  {
    icon: IconLock,
    label: 'login_and_security',
    route: '/user/security',
    notification: true,
  },
  {
    icon: IconWifi,
    label: 'network_test',
    route: '/user/network-test',
  },
  {
    icon: IconClearAll,
    label: 'clear_cache',
  },
  {
    icon: IconScale,
    label: 'legal',
    route: '/user/legal',
  },
  {
    icon: IconHelp,
    label: 'help_and_faqs',
    route: '/user/help',
  },
  {
    icon: IconCarouselHorizontal,
    label: 'onboarding_menu',
    route: '/onboarding',
  },
  {
    icon: IconLogout,
    label: 'log_out',
    color: '#EF4444',
  },
];

export const conditions: string[] = [
  'Asthma',
  'Birth Control',
  'Blood Pressure Management',
  'Cholesterol Management',
  'Chronic Allergies',
  'Cold & Flu',
  'Diabetes',
  'Digestive Issues',
  'Diuresis',
  'Endometriosis',
  'Eye Disorders',
  'Gout',
  'Hair Loss',
];

export const quickActions: QuickActionItem[] = [
  {
    icon: IconCreditCard,
    label: 'doctor_go_wallet',
    route: '/wallet',
  },
  {
    icon: IconVideo,
    label: 'call_doctor_now',
  },
  {
    icon: IconCalendarDot,
    label: 'book_an_appointment',
    route: '/book/appointment',
  },
  {
    icon: IconMessage2,
    label: 'referral_support',
  },
  {
    icon: IconMedicalCrossCircle,
    label: 'shop_meds_wellness',
    route: '/marketplace',
  },
];

export const profileSettings: ProfileSettingItem[] = [
  {
    icon: IconUser,
    label: 'about_me',
    route: '/user/about',
  },
  {
    icon: IconUsers,
    label: 'dependants',
    route: '/user/dependants',
  },
  {
    icon: IconPhone,
    label: 'contact_details',
    route: '/user/contact',
  },
  {
    icon: IconAlarm,
    label: 'emergency_contact_details',
    route: '/user/emergency',
  },
  {
    icon: IconSmartHome,
    label: 'address',
    route: '/user/address',
  },
  {
    icon: IconCreditCard,
    label: 'payment_method',
    route: '/user/payment',
  },
  {
    icon: IconTrash,
    label: 'delete_account',
    route: '',
    color: '#EF4444',
  },
];
