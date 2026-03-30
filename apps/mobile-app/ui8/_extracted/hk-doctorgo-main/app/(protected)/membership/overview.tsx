import { View } from 'react-native';
import Header from '@/components/header';
import Container from '@/components/container';
import { TabContainer } from '@/components/tab-container';
import Animated, { FadeInUp } from 'react-native-reanimated';
import images from '@/data/images';
import CardHealthplan from '@/components/card-healthplan';
import CardMembership from '@/components/card-membership';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { healthPlanTypes } from '@/data/common';

export default function Overview() {
  const { t } = useTranslation();
  const tabs = ['Browse Plans', 'My Benefits'] as const;
  type TabType = (typeof tabs)[number];

  const tabContent: Record<TabType, React.ReactNode> = {
    ['Browse Plans']: (
      <View key={t('browse_plans')} className="gap-6 mb-6">
        <Animated.View entering={FadeInUp.duration(400)}>
          <CardMembership
            title={t('link_your_membership')}
            description={t('link_membership_description')}
            image={images.membership2}
            delay={200}
            buttonText={t('link_your_membership')}
            onPress={() => router.push('/membership')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <Header name={t('choose_your_health_plan')} goBack={false} />
        </Animated.View>

        <View className="gap-4">
          {healthPlanTypes.map((healthPlan, index) => (
            <CardHealthplan
              key={healthPlan.name}
              title={t(healthPlan.name)}
              description={t(healthPlan.description)}
              price={t(healthPlan.price)}
              image={healthPlan.image}
              delay={(index + 1) * 400}
              onPress={() =>
                router.push({
                  pathname: '/membership/[slug]',
                  params: { slug: healthPlan.slug },
                })
              }
            />
          ))}
        </View>
      </View>
    ),
    ['My Benefits']: (
      <View key={t('my_benefits')} className="gap-6 mb-6">
        <Animated.View entering={FadeInUp.duration(400)}>
          <CardMembership
            title={t('lifetime_membership')}
            description={t('lifetime_membership_description')}
            image={images.membership}
            delay={200}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(400)}>
          <CardHealthplan
            title={t('doctor_go_perks')}
            description={t('doctor_go_perks_description')}
            image={images.perks}
            delay={400}
          />
        </Animated.View>
      </View>
    ),
  };

  return (
    <Container>
      <Header name={t('my_membership_and_health_plan')} />

      <TabContainer
        tabs={tabs}
        tabLabel={[t('healthwise_plus'), t('healthwise_basic')]}
        initialTab="Browse Plans"
        renderContent={(tab) => tabContent[tab]}
      />
    </Container>
  );
}
