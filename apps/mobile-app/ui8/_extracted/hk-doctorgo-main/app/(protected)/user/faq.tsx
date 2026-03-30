import { ScrollView } from 'react-native';
import Container from '@/components/container';
import Header from '@/components/header';
import { useTranslation } from 'react-i18next';
import Accordion from '@/components/accordion';

export default function FQA() {
  const { t } = useTranslation();

  const data = [
    {
      id: 1,
      title: t('faq_book_consultation'),
      body: t('faq_book_consultation_answer'),
    },
    {
      id: 2,
      title: t('faq_payment_methods'),
      body: t('faq_payment_methods_answer'),
    },
    {
      id: 3,
      title: t('faq_medical_certificates'),
      body: t('faq_medical_certificates_answer'),
    },
    {
      id: 4,
      title: t('faq_reschedule'),
      body: t('faq_reschedule_answer'),
    },
    {
      id: 5,
      title: t('faq_data_security'),
      body: t('faq_data_security_answer'),
    },
    {
      id: 6,
      title: t('faq_contact'),
      body: t('faq_contact_answer'),
    },
  ];

  return (
    <Container className="gap-4">
      <Header name={t('frequently_asked_questions')} />

      <ScrollView contentContainerClassName="gap-4">
        {data.map((item) => (
          <Accordion item={item} key={item.id} />
        ))}
      </ScrollView>
    </Container>
  );
}
