import { View } from 'react-native';

type TabBarIconProps = {
  icon: React.ReactNode;
  color: string;
};

export default function TabBarIcon({ icon, color }: TabBarIconProps) {
  return (
    <View className="flex justify-center items-center">
      <View
        className="absolute top-[-11px] w-[58px] h-[2px] rounded-full"
        style={{ backgroundColor: color }}
      />
      {icon}
    </View>
  );
}
