import Header from '@/components/header';
import { virtualConsultationData } from '@/data/common';
import { ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import CardAppointment from '@/components/card-appointment';
import { useTranslation } from 'react-i18next';
import { VirtualConsultationItem } from '@/types/common';
import Container from '@/components/container';

export default function Appointment() {
  const { t } = useTranslation();

  return (
    <Container>
      <Animated.View entering={FadeInUp.duration(200)}>
        <Header name={t('book_an_appointment')} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        className="my-6">
        {virtualConsultationData.map(
          ({ title, image, price }: VirtualConsultationItem, index: number) => (
            <CardAppointment
              title={t(title)}
              image={image}
              price={price}
              key={index}
              index={index}
            />
          ),
        )}
      </ScrollView>
    </Container>
  );
}
