import { View, Text, TouchableOpacity } from 'react-native';
import { IconGenderFemale, IconGenderMale, IconTrash } from '@tabler/icons-react-native';
import { useRef, useCallback } from 'react';
import Avatar from '@/components/avatar';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import colors from 'tailwindcss/colors';
import { UserState } from '@/store/user';
import { useColorScheme } from 'nativewind';

export type DependantData = {
  firstName: string;
  lastName: string;
  gender: string;
  relationship: string;
};

type CardDependantProps = {
  dependant: DependantData;
  index: number;
  userStore: UserState;
};

const RightActions = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="px-3 h-full justify-center">
    <IconTrash size={24} color={colors.red[400]} />
  </TouchableOpacity>
);

export default function CardDependant({ dependant, index, userStore }: CardDependantProps) {
  const swipeableRefs = useRef<(typeof Swipeable)[]>([]);
  const { colorScheme } = useColorScheme();

  const handleRemoveDependant = useCallback(
    (index: number) => {
      userStore.removeDependant(index);

      if (swipeableRefs.current[index]) {
        (swipeableRefs.current[index] as any).close();
      }
    },
    [userStore],
  );

  const setSwipeableRef = useCallback((ref: any, index: number) => {
    if (ref) {
      swipeableRefs.current[index] = ref;
    }
  }, []);

  return (
    <Swipeable
      ref={(ref) => setSwipeableRef(ref, index)}
      renderRightActions={() => <RightActions onPress={() => handleRemoveDependant(index)} />}
      overshootRight={false}>
      <View className="flex-row items-start p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center gap-4">
          <Avatar
            initials={`${dependant.firstName[0].toUpperCase()}${dependant.lastName[0].toUpperCase()}`}
            size="sm"
          />

          <View className="flex-row justify-between items-center flex-1">
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                {dependant.firstName} {dependant.lastName}
              </Text>

              <Text className="text-sm text-slate-500 dark:text-slate-300 capitalize">
                {dependant.relationship}
              </Text>
            </View>

            {dependant.gender === 'male' ? (
              <IconGenderMale color={colorScheme === 'light' ? colors.slate[400] : colors.white} />
            ) : (
              <IconGenderFemale
                color={colorScheme === 'light' ? colors.slate[400] : colors.white}
              />
            )}
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
