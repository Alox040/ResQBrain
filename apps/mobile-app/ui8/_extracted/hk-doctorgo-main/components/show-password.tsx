import { IconEye, IconEyeOff } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';

type ShowPasswordProps = {
  showPassword: boolean;
  handlePress: () => void;
};

export default function ShowPassword({ showPassword, handlePress }: ShowPasswordProps) {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="absolute right-0 mr-3 my-3"
      onPress={handlePress}>
      {showPassword ? (
        <IconEye color={colorScheme === 'light' ? '#514DDF' : colors.white} />
      ) : (
        <IconEyeOff color={colorScheme === 'light' ? '#514DDF' : colors.white} />
      )}
    </TouchableOpacity>
  );
}
