import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

type Option = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

type RadioGroupProps = {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  error?: string;
};

export default function RadioGroup({
  options,
  selectedValue,
  onValueChange,
  error,
}: RadioGroupProps) {
  return (
    <View className="gap-3">
      <View className="flex-row gap-4">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onValueChange(option.value)}
            className={`justify-center items-center gap-2 flex-grow border rounded-2xl px-4 py-6 ${
              selectedValue === option.value
                ? 'border-[#514DDF] bg-indigo-100 dark:bg-indigo-700'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
            }`}>
            {option.icon}

            <Text className="text-center font-medium w-[100px] text-slate-800 dark:text-slate-100">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text className="text-sm text-red-500 dark:text-red-500/80">{error}</Text>}
    </View>
  );
}
