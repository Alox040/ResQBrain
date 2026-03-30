import { IconChevronRight } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import NotificationIndicator from './notification-indicator';
import { SettingsLink } from '@/types/common';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

export default function SettingItem({ item }: { item: SettingsLink }) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800"
      onPress={item.onPress}>
      <View className="flex-row items-center gap-3">
        {(item.icon || item.notification) && (
          <View className="relative">
            {item.icon && (
              <item.icon
                size={20}
                color={
                  colorScheme === 'light'
                    ? item.color || colors.slate[500]
                    : item.color || colors.slate[400]
                }
              />
            )}

            {item.notification && <NotificationIndicator />}
          </View>
        )}

        <Text
          className={`text-base font-sans ${item.color ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
          {t(item.label)}
        </Text>
      </View>

      <View className="flex-row items-center">
        {item.rightText && (
          <Text className="text-slate-500 dark:text-slate-100 mr-2 font-sans">
            {item.rightText === 'current_theme'
              ? t(colorScheme === 'light' ? 'light' : 'dark')
              : t(item.rightText)}
          </Text>
        )}

        <IconChevronRight size={20} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
}
