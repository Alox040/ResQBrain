import { View, Text } from 'react-native';
import { default as BaseModal } from 'react-native-modal';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import { IconHelpCircleFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

type SimpleModalProps = {
  isVisible: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryButtonText: string;
  onPrimaryButtonPress: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  secondaryButton?: boolean;
  onClose?: () => void;
  onModalHide?: () => void;
};

export default function Modal({
  isVisible,
  title,
  description,
  icon,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  secondaryButton = true,
  onClose,
  onModalHide,
}: SimpleModalProps) {
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onModalHide={onModalHide}>
      <View className="bg-white dark:bg-slate-900 rounded-3xl mx-4">
        <View className="items-center p-6 gap-4">
          {icon || (
            <IconHelpCircleFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />
          )}

          <Text className="text-slate-800 dark:text-slate-100 text-lg font-medium text-center">
            {title}
          </Text>

          {description && (
            <Text className="text-slate-800 dark:text-slate-100 text-base font-sans text-center">
              {description}
            </Text>
          )}

          <View className="gap-2 w-full mt-6">
            <ButtonPrimary text={primaryButtonText} onPress={onPrimaryButtonPress} />

            {secondaryButton && (
              <ButtonSecondary
                text={secondaryButtonText || t('cancel')}
                onPress={onSecondaryButtonPress || onClose}
              />
            )}
          </View>
        </View>
      </View>
    </BaseModal>
  );
}
