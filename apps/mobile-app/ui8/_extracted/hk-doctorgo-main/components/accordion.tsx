import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react-native';

type AccordionProps = {
  id: number;
  title: string;
  body: string;
};

export default function Accordion({ item }: { item: AccordionProps }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <TouchableOpacity
      onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-medium flex-1 mr-4 text-slate-800 dark:text-white">
          {item.title}
        </Text>

        {expandedId === item.id ? (
          <IconChevronUp size={20} color="#64748B" />
        ) : (
          <IconChevronDown size={20} color="#64748B" />
        )}
      </View>

      {expandedId === item.id && (
        <Text className="text-slate-600 dark:text-slate-400 mt-2 font-sans leading-relaxed">
          {item.body}
        </Text>
      )}
    </TouchableOpacity>
  );
}
