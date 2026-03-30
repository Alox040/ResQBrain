import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { IconCircleCheck } from '@tabler/icons-react-native';
import Header from '@/components/header';
import { languages } from '@/data/common';
import { Language } from '@/types/common';
import Container from '@/components/container';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

export default function Languages() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);

    i18n.changeLanguage(lang);
  };

  return (
    <Container>
      <Header name={t('languages')} />

      <ScrollView showsHorizontalScrollIndicator={false} className="gap-6 mt-5">
        {languages.map(({ lang, name }: Language) => (
          <TouchableOpacity
            key={name}
            onPress={() => changeLanguage(lang)}
            className="flex-row justify-between items-center py-5 border-b border-slate-100 dark:border-slate-800">
            <Text className="text-lg font-medium text-slate-800 dark:text-slate-100 h-8">
              {name}
            </Text>

            {currentLanguage === lang &&
              (colorScheme === 'light' ? (
                <IconCircleCheck size={28} fill={'#514DDF'} stroke={'#fff'} />
              ) : (
                <IconCircleCheck size={28} stroke={colors.slate[900]} fill={colors.white} />
              ))}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
}
