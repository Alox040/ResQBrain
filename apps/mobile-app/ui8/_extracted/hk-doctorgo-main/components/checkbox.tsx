import { TouchableOpacity, useColorScheme } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Label from './label';
import colors from 'tailwindcss/colors';

type SimpleCheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
};

export default function Checkbox({
  label,
  checked,
  onChange,
  size = 24,
  ...rest
}: SimpleCheckboxProps) {
  const colorScheme = useColorScheme();
  const handlePress = () => onChange(!checked);

  return (
    <TouchableOpacity
      className="flex-row items-center gap-2 flex-1"
      onPress={handlePress}
      activeOpacity={0.8}>
      <BouncyCheckbox
        isChecked={checked}
        disableText
        useBuiltInState={false}
        fillColor="#514DDF"
        unFillColor={
          colorScheme === 'light'
            ? colorScheme === 'light'
              ? colors.white
              : colors.slate[800]
            : colors.slate[800]
        }
        onPress={handlePress}
        size={size}
        {...rest}
      />

      {label && <Label text={label} />}
    </TouchableOpacity>
  );
}
