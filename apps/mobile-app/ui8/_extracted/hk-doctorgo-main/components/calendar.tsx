import { default as BaseCalendar } from 'react-native-calendar-picker';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react-native';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

type SimpleCalendarProps = {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
};

export default function Calendar({
  selectedDate,
  onDateChange,
  onClose,
  minDate,
  maxDate = new Date(),
  ...rest
}: SimpleCalendarProps & Partial<React.ComponentProps<typeof BaseCalendar>>) {
  const { colorScheme } = useColorScheme();

  return (
    <BaseCalendar
      startFromMonday={true}
      minDate={minDate}
      maxDate={maxDate}
      selectedDayColor="#514DDF"
      selectedDayTextColor="#FFFFFF"
      textStyle={{
        fontFamily: 'rubik-medium',
        fontSize: 14,
        color: colorScheme === 'light' ? colors.slate[800] : colors.slate[100],
      }}
      selectedDayTextStyle={{
        color: colorScheme === 'light' ? colors.white : colors.white,
      }}
      todayBackgroundColor={colorScheme === 'light' ? colors.slate[800] : colors.slate[800]}
      todayTextStyle={{
        color: colorScheme === 'light' ? colors.slate[800] : colors.slate[100],
      }}
      dayLabelsWrapper={{
        borderTopWidth: 0,
        borderBottomWidth: 0,
      }}
      disabledDatesTextStyle={{
        color: colorScheme === 'light' ? colors.slate[400] : colors.slate[600],
      }}
      previousComponent={
        <View className="items-center justify-center p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl">
          <IconChevronLeft
            size={20}
            color={colorScheme === 'light' ? colors.slate[800] : colors.slate[100]}
          />
        </View>
      }
      nextComponent={
        <View className="items-center justify-center p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl">
          <IconChevronRight
            size={20}
            color={colorScheme === 'light' ? colors.slate[800] : colors.slate[100]}
          />
        </View>
      }
      selectedStartDate={selectedDate ? dayjs(selectedDate, 'DD/MM/YYYY').toString() : undefined}
      onDateChange={(date) => {
        onDateChange(dayjs(date).format('DD/MM/YYYY'));
        onClose?.();
      }}
      {...rest}
    />
  );
}
