import { View, Text, TouchableOpacity } from 'react-native';
import { default as BaseBottomSheet } from 'react-native-modal';
import { ReactNode } from 'react';
import { IconArrowLeft } from '@tabler/icons-react-native';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

type BottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showDoneButton?: boolean;
  hasLeftAction?: boolean;
  leftAction?: () => void;
  closeText?: string;
  onModalHide?: () => void;
};

export default function BottomSheet({
  isVisible,
  onClose,
  children,
  title,
  showDoneButton = true,
  hasLeftAction = false,
  leftAction,
  closeText,
  onModalHide,
  ...rest
}: BottomSheetProps & Partial<typeof BaseBottomSheet.defaultProps>) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <BaseBottomSheet
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      backdropOpacity={0.2}
      style={{ margin: 0 }}
      onModalHide={onModalHide}
      {...rest}>
      <View className="flex-1 justify-end">
        <View className="bg-white dark:bg-slate-900 rounded-t-3xl pt-4 px-6 pb-6">
          <View className="items-center mb-4">
            <View className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
          </View>

          {(title || showDoneButton) && (
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                {hasLeftAction && (
                  <TouchableOpacity onPress={leftAction}>
                    <IconArrowLeft
                      size={24}
                      color={colorScheme === 'light' ? colors.slate[800] : colors.white}
                    />
                  </TouchableOpacity>
                )}

                {title && (
                  <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {title}
                  </Text>
                )}
              </View>

              {showDoneButton && (
                <TouchableOpacity onPress={onClose}>
                  <Text className="text-primary dark:text-indigo-500 font-medium">
                    {closeText || t('done')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {children}
        </View>
      </View>
    </BaseBottomSheet>
  );
}
