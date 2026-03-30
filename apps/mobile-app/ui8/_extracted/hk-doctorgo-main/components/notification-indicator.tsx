import { IconPointFilled } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import colors from 'tailwindcss/colors';

export default function NotificationIndicator() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="absolute -top-3 -right-3">
      <IconPointFilled
        fill={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
        strokeWidth={0}
      />
    </View>
  );
}
