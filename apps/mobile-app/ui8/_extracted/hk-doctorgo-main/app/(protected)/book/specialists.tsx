import CardDoctor from '@/components/card-doctor';
import Container from '@/components/container';
import Header from '@/components/header';
import { specialistsData } from '@/data/common';
import { SpecialistItem } from '@/types/common';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

export default function Specialists() {
  const { t } = useTranslation();

  return (
    <Container>
      <Header name={t('book_specialists')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        className="mt-5">
        {specialistsData.map(({ title, desc, image, price }: SpecialistItem, index: number) => (
          <CardDoctor title={title} desc={desc} image={image} price={price} key={index} />
        ))}
      </ScrollView>
    </Container>
  );
}
