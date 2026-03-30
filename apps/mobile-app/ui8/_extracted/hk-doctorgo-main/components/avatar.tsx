import { View, Text, Image } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type AvatarColor = 'primary' | 'secondary' | 'green' | 'amber' | 'red' | 'blue';

type AvatarProps = {
  initials?: string;
  imageUrl?: string;
  size?: AvatarSize;
  color?: AvatarColor;
};

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-12 h-12', text: 'text-lg' },
  md: { container: 'w-16 h-16', text: 'text-2xl' },
  lg: { container: 'w-20 h-20', text: 'text-3xl' },
  xl: { container: 'w-24 h-24', text: 'text-4xl' },
};

const colorStyles: Record<AvatarColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-slate-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};

export default function Avatar({
  initials,
  imageUrl,
  size = 'md',
  color = 'primary',
}: AvatarProps) {
  return (
    <View
      className={`rounded-full overflow-hidden items-center justify-center ${sizeStyles[size].container} ${
        !imageUrl ? colorStyles[color] : ''
      }`}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
      ) : (
        <Text className={`text-white font-medium ${sizeStyles[size].text}`}>{initials}</Text>
      )}
    </View>
  );
}
