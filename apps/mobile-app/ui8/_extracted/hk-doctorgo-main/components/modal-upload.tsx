import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IconFolderFilled } from '@tabler/icons-react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import ButtonPrimary from './button-primary';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useHealthStore } from '@/store/health';

type UploadModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onPress?: () => void;
  title: string;
  recordType: string;
};

export default function ModalUpload({
  isVisible,
  onClose,
  onPress,
  title,
  recordType,
}: UploadModalProps) {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const addRecord = useHealthStore((state) => state.addRecord);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;

      setImage(fileUri);
    }
  };

  const handleUpload = () => {
    if (image) {
      addRecord({
        type: recordType,
        fileName: image.split('/').pop() || 'Untitled',
        fileUrl: image,
      });
      setImage(null);
      onClose();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      className="m-4">
      <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 gap-4">
        <Text className="text-slate-800 dark:text-slate-100 text-xl font-semibold">{title}</Text>

        {image ? (
          <View className="gap-4">
            <Image source={{ uri: image }} className="w-full h-[200px] rounded-xl" />

            <ButtonPrimary text="Upload" onPress={handleUpload} />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              pickImage();
              onPress?.();
            }}
            className="border-2 border-dashed border-indigo-100 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 rounded-2xl p-8 items-center justify-center">
            <IconFolderFilled size={48} color="#818CF8" fill="#818CF8" />

            <Text className="text-indigo-600 dark:text-indigo-400 font-medium mt-2">
              {t('upload')} {recordType}
            </Text>

            <Text className="text-slate-500 dark:text-slate-100 text-sm mt-1">
              {t('tap_to_browse_files')}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-slate-500 dark:text-slate-100 text-sm text-center">
          {t('please_note_that_uploaded')} {recordType.toLowerCase()} {t('will_be_reviewed')}.
        </Text>
      </View>
    </Modal>
  );
}
