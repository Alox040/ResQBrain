import { IconChevronDown, IconSearch } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Dropdown as BaseDropdown } from 'react-native-element-dropdown';
import colors from 'tailwindcss/colors';
import InputText from './input-text';
import { useColorScheme } from 'nativewind';
import clsx from 'clsx';
import Label from './label';

type SimpleDropdownProps = {
  label?: string;
  value: any;
  data: { label: string; value: string }[];
  onChange: (item: { label: string; value: string }) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
};

export default function Dropdown({
  label,
  value,
  data,
  onChange,
  searchable = true,
  placeholder,
  error,
}: SimpleDropdownProps) {
  const { t } = useTranslation();
  const [isFocus, setIsFocus] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-3">
      {label && <Label text={label} />}

      <BaseDropdown
        style={{
          height: 40,
          borderWidth: 1,
          borderRadius: 24,
          paddingHorizontal: 8,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: isFocus
            ? !!error
              ? colorScheme === 'light'
                ? '#fff8f8'
                : colors.slate[900]
              : colorScheme === 'light'
                ? colors.white
                : colors.slate[900]
            : colorScheme === 'light'
              ? colors.white
              : colors.slate[900],
          zIndex: 999,
          borderColor: !!error
            ? colorScheme === 'light'
              ? colors.red[400]
              : colors.red[800]
            : colorScheme === 'light'
              ? colors.slate[200]
              : colors.slate[800],
        }}
        containerStyle={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: colorScheme === 'light' ? colors.white : colors.slate[900],
          borderColor: colorScheme === 'light' ? colors.slate[200] : colors.slate[800],
        }}
        placeholderStyle={{
          fontSize: 14,
          color: colors.slate[300],
          fontFamily: 'rubik-regular',
          paddingHorizontal: 8,
        }}
        selectedTextStyle={{
          fontSize: 14,
          paddingHorizontal: 8,
          color: colorScheme === 'light' ? colors.slate[800] : colors.slate[100],
          fontFamily: 'rubik-regular',
        }}
        inputSearchStyle={{
          height: 40,
          fontSize: 14,
          borderRadius: 24,
        }}
        iconStyle={{
          width: 24,
          height: 24,
        }}
        data={data}
        search={searchable}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder || t('select_option') : '...'}
        searchPlaceholder={t('search')}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderItem={(item, selected) => (
          <View key={item.value}>
            <Text
              className={clsx(
                'font-sans px-4 py-4',
                selected
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white'
                  : 'text-slate-800 dark:text-slate-100',
              )}>
              {item.label}
            </Text>
          </View>
        )}
        renderRightIcon={() => <IconChevronDown color={colors.slate[400]} />}
        itemContainerStyle={{
          backgroundColor: colorScheme === 'light' ? colors.white : colors.slate[900],
        }}
        renderInputSearch={(onSearch) => (
          <View className="p-2">
            <InputText
              placeholder={t('search')}
              onChangeText={onSearch}
              prefixIcon={<IconSearch size={20} color={colors.slate[400]} />}
            />
          </View>
        )}
        onChange={(item) => {
          onChange(item);
          setIsFocus(false);
        }}
      />

      {error && <Text className="text-sm text-red-500 dark:text-red-500/80">{error}</Text>}
    </View>
  );
}
