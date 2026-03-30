import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRef, useCallback } from 'react';
import { HealthRecord } from '@/store/health';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { IconTrash } from '@tabler/icons-react-native';
import colors from 'tailwindcss/colors';
import dayjs from 'dayjs';

type CardHealthRecordProps = {
  record: HealthRecord;
  removeRecord: (id: string) => void;
  index: number;
};

const RightActions = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="px-3 h-full justify-center">
    <IconTrash size={24} color={colors.red[400]} />
  </TouchableOpacity>
);

export default function CardHealthRecord({ record, removeRecord, index }: CardHealthRecordProps) {
  const swipeableRefs = useRef<(typeof Swipeable)[]>([]);

  const handleRemoveRecord = useCallback(
    (id: string, index: number) => {
      removeRecord(id);
      if (swipeableRefs.current[index]) {
        (swipeableRefs.current[index] as any).close();
      }
    },
    [removeRecord],
  );

  const setSwipeableRef = useCallback((ref: any, index: number) => {
    if (ref) {
      swipeableRefs.current[index] = ref;
    }
  }, []);

  return (
    <Swipeable
      ref={(ref) => setSwipeableRef(ref, index)}
      renderRightActions={() => (
        <RightActions onPress={() => handleRemoveRecord(record.id, index)} />
      )}
      overshootRight={false}>
      <Animated.View
        className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
        entering={FadeInUp.duration(400)}>
        <View className="flex-row justify-between items-center gap-3">
          <Image source={{ uri: record.fileUrl }} className="w-24 h-24 rounded-xl" />

          <View className="gap-1 flex-1">
            <Text className="text-base font-semibold text-slate-800 dark:text-white">
              {record.type}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-300 lowercase">
              {record.fileName}
            </Text>
            <Text className="text-xs text-slate-400 dark:text-slate-300">
              {dayjs(record.uploadDate).format('DD MMM, hh:mm A')}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
}
