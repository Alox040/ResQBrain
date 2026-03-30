import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/header';
import images from '@/data/images';
import { useState } from 'react';
import Container from '@/components/container';
import Banner from '@/components/banner';
import Badge from '@/components/badge';
import BottomSheet from '@/components/bottom-sheet';
import ButtonPrimary from '@/components/button-primary';
import { useTranslation } from 'react-i18next';

export default function Prescribed() {
  const { t } = useTranslation();
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<string>('details');
  const title = slug.toString().charAt(0).toUpperCase() + slug.toString().slice(1);

  const handleNext = () => {
    if (modalStep === 'details') {
      setModalStep('consultation');
    } else {
      setModalVisible(false);
      setModalStep('details');
      router.push('/book/doctor');
    }
  };

  const renderDetailsContent = () => (
    <View>
      <Text className="font-sans mb-6">$30 ({t('excludes_consultation_fee')})</Text>

      <Image
        source={images.logo2}
        className="w-full h-48 rounded-2xl bg-slate-100 mb-6"
        resizeMode="contain"
      />

      <Text className="text-slate-600 mb-6 leading-relaxed font-sans">
        This treatment is for {title} {t('treatment')}
      </Text>

      <Text className="text-slate-600 mb-6 leading-relaxed font-sans">
        Please note that the prescribed treatment is subject to the professional discretion of
        licensed medical practitioners and may vary depending on each individual patient's medical
        condition, history, and other factors. You may receive a different treatment regimen. Prices
        may also vary depending on the treatment prescribed by the doctor.
      </Text>
    </View>
  );

  const renderConsultationContent = () => (
    <View className="gap-6 mb-6">
      <Text className="text-slate-600 font-sans leading-relaxed">
        To continue, you'll have to video consult a medical professional on our app. If you have any
        specific requests, please let the medical professional know. You'll not be charged if you're
        unsuitable for the condition.
      </Text>

      <Text className="text-slate-600 font-sans leading-relaxed">
        Our video consultation service is only suitable for non-urgent conditions. For more serious
        conditions, please go for a physical consultation or call 123.
      </Text>

      <Text className="text-slate-600 font-sans leading-relaxed">
        The average waiting time for our video consultation is 5 min during peak hrs & 1 min during
        off peak hrs.
      </Text>

      <Text className="text-slate-600 font-sans leading-relaxed">
        All our medical professionals are registered with the World Medical Council.
      </Text>
    </View>
  );

  return (
    <Container>
      <Header name={title} />

      <Banner
        title={t('requires_consultation')}
        description={t('requires_consultation_description')}
        className="my-6"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-4">
        <TouchableOpacity
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex-row items-center"
          onPress={() => setModalVisible(true)}>
          <Image source={images.logo2} className="w-16 h-16 rounded-xl bg-slate-100" />

          <View className="flex-1 ml-4">
            <Badge text={t('requires_consultation')} />

            <Text className="text-lg font-medium text-slate-800 dark:text-white">
              {title} {t('treatment')}
            </Text>

            <Text className="text-slate-500 dark:text-slate-400">$30</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex-row items-center"
          onPress={() => setModalVisible(true)}>
          <Image source={images.logo2} className="w-16 h-16 rounded-xl bg-slate-100" />

          <View className="flex-1 ml-4">
            <Badge text={t('requires_consultation')} />

            <Text className="text-lg font-medium text-slate-800 dark:text-white">
              {title} {t('treatment')} II
            </Text>

            <Text className="text-slate-500 dark:text-slate-400">$50</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <BottomSheet
        isVisible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          setModalStep('details');
        }}
        title={modalStep === 'details' ? `${title} ${t('treatment')}` : t('video_consultation')}>
        {modalStep === 'details' ? renderDetailsContent() : renderConsultationContent()}

        <ButtonPrimary
          text={modalStep === 'details' ? t('next') : t('got_it')}
          onPress={handleNext}
        />
      </BottomSheet>
    </Container>
  );
}
