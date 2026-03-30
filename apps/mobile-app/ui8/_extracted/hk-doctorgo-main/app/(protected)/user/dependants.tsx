import { View, Text, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconAlertCircleFilled, IconPlus } from '@tabler/icons-react-native';
import { useState } from 'react';
import Container from '@/components/container';
import Header from '@/components/header';
import images from '@/data/images';
import Modal from '@/components/modal';
import ButtonPrimary from '@/components/button-primary';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/user';
import ModalDependant from '@/components/modal-dependant';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import colors from 'tailwindcss/colors';
import Animated, { LinearTransition, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import CardDependant from '@/components/card-dependant';

export default function Dependants() {
  const router = useRouter();
  const { t } = useTranslation();
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const [dependantModalVisible, setDependantModalVisible] = useState<boolean>(false);
  const userStore = useUserStore();
  const { colorScheme } = useColorScheme();

  const handleAddDependants = () => {
    if (!userStore.complete()) {
      setProfileModalVisible(true);
    } else {
      setDependantModalVisible(true);
    }
  };

  return (
    <GestureHandlerRootView>
      <Container>
        <Header
          name={t('dependants')}
          className="justify-between"
          onPress={() => setDependantModalVisible(true)}
          postfixIcon={
            <IconPlus
              size={24}
              color={colorScheme === 'light' ? colors.slate[800] : colors.white}
            />
          }
        />

        {userStore.getDependants()?.length ? (
          <ScrollView
            className="mt-4"
            contentContainerClassName="gap-4"
            showsVerticalScrollIndicator={false}>
            {userStore.getDependants().map((dependant, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 100)}
                layout={LinearTransition.springify()}>
                <CardDependant dependant={dependant} index={index} userStore={userStore} />
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Image
              source={images.dependants}
              className="w-[280px] h-[380px]"
              resizeMode="contain"
            />

            <Text className="text-xl font-semibold text-center text-slate-800 dark:text-slate-100 mb-2">
              {t('no_dependants_yet')}
            </Text>

            <Text className="text-slate-600 dark:text-slate-400 font-sans text-center leading-relaxed mb-8">
              {t('add_dependants_description')}
            </Text>

            <ButtonPrimary
              text={t('add_dependant')}
              onPress={handleAddDependants}
              className="w-full"
            />
          </View>
        )}

        <Modal
          isVisible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          icon={<IconAlertCircleFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
          title={t('profile_not_completed')}
          description={t('complete_profile_first')}
          primaryButtonText={t('ok_continue')}
          onPrimaryButtonPress={() => {
            setProfileModalVisible(false);

            router.push('/user/about');
          }}
        />

        <ModalDependant
          title="Add Dependants"
          isVisible={dependantModalVisible}
          onClose={() => setDependantModalVisible(false)}
        />
      </Container>
    </GestureHandlerRootView>
  );
}
