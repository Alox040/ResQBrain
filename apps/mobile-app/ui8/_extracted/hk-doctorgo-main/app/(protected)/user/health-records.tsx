import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Container from '@/components/container';
import Header from '@/components/header';
import images from '@/data/images';
import Animated, { FadeInUp, FadeInDown, LinearTransition } from 'react-native-reanimated';
import ButtonPrimary from '@/components/button-primary';
import { TabContainer } from '@/components/tab-container';
import BottomSheet from '@/components/bottom-sheet';
import { useState } from 'react';
import ModalUpload from '@/components/modal-upload';
import { useTranslation } from 'react-i18next';
import { useHealthStore } from '@/store/health';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CardHealthRecord from '@/components/card-health-record';

export default function HealthRecords() {
  const { t } = useTranslation();
  const tabs = ['Your Records', 'Upload'] as const;
  type TabType = (typeof tabs)[number];
  const [activeTab, setActiveTab] = useState<TabType>('Your Records');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const { getRecords, removeRecord } = useHealthStore();

  const handleRecordTypeSelect = (type: string) => {
    setSelectedType(type);

    setIsBottomSheetOpen(false);
  };

  const recordTypes = [
    t('lab_results'),
    t('radiology'),
    t('personal_records'),
    t('immunisations'),
    t('consultation_documents'),
  ];

  const tabContent: Record<TabType, React.ReactNode> = {
    'Your Records': (
      <View key="Your Records">
        {getRecords()?.length > 0 ? (
          <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
            {getRecords().map((record, index) => (
              <Animated.View
                key={record.id}
                entering={FadeInDown.delay(index * 100)}
                layout={LinearTransition.springify()}>
                <CardHealthRecord
                  record={record}
                  key={index}
                  removeRecord={removeRecord}
                  index={index}
                />
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <>
            <Animated.View className="items-center" entering={FadeInUp.duration(400)}>
              <Image source={images.records} className="w-[280px] h-[380px]" resizeMode="contain" />
            </Animated.View>

            <Animated.Text
              className="text-xl font-semibold mb-2 text-center text-slate-800 dark:text-slate-100"
              entering={FadeInUp.duration(400).delay(100)}>
              {t('no_health_records_yet')}
            </Animated.Text>

            <Animated.Text
              className="mx-auto text-slate-600 dark:text-slate-400 text-center font-sans leading-relaxed mb-8"
              entering={FadeInUp.duration(400).delay(200)}>
              {t('health_screening_description')}
            </Animated.Text>
          </>
        )}
      </View>
    ),
    Upload: (
      <View key="Upload">
        <Animated.View className="items-center" entering={FadeInUp.duration(400)}>
          <Image source={images.upload} className="w-[280px] h-[380px]" resizeMode="contain" />
        </Animated.View>

        <Animated.Text
          className="text-xl font-semibold mb-2 text-center text-slate-800 dark:text-slate-100"
          entering={FadeInUp.duration(400).delay(100)}>
          {t('upload_and_store_records')}
        </Animated.Text>

        <Animated.Text
          className="w-4/5 mx-auto text-slate-600 dark:text-slate-400 text-center font-sans leading-relaxed mb-8"
          entering={FadeInUp.duration(400).delay(200)}>
          {t('upload_description')}
        </Animated.Text>

        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <ButtonPrimary
            text={t('upload_health_records')}
            onPress={() => setIsBottomSheetOpen(true)}
            className="w-full mb-6"
          />
        </Animated.View>
      </View>
    ),
  };

  return (
    <GestureHandlerRootView>
      <Container>
        <Header name={t('health_records')} />

        <TabContainer
          tabs={tabs}
          tabLabel={[t('your_records'), t('upload')]}
          initialTab={activeTab}
          className="mt-4"
          renderContent={(tab) => tabContent[tab]}
          onTabChange={setActiveTab}
        />

        <ModalUpload
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);

            setActiveTab('Your Records');
          }}
          title={t('upload_records')}
          recordType={selectedType}
        />

        <BottomSheet
          isVisible={isBottomSheetOpen}
          onClose={() => {
            setIsBottomSheetOpen(false);

            setSelectedType('');
          }}
          onModalHide={() => {
            if (selectedType) {
              setIsModalVisible(true);
            }
          }}
          title={t('select_record_type')}>
          {recordTypes.map((type: string, index: number) => (
            <TouchableOpacity
              key={index}
              className="py-4 border-b border-slate-100 dark:border-slate-800"
              onPress={() => handleRecordTypeSelect(type)}>
              <Text className="text-base font-sans text-slate-800 dark:text-white">{type}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheet>
      </Container>
    </GestureHandlerRootView>
  );
}
