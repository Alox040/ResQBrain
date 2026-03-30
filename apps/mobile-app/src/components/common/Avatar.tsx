import React from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { COLORS } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarTone =
  | 'primary'
  | 'neutral'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue';

export type AvatarProps = {
  /** Single initial or up to ~2 chars */
  initials?: string;
  /** Remote URL */
  imageUrl?: string;
  /** Local bundled image */
  imageSource?: ImageSourcePropType;
  size?: AvatarSize;
  tone?: AvatarTone;
};

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 96,
};

const FONT_SIZE: Record<AvatarSize, number> = {
  sm: 18,
  md: 22,
  lg: 28,
  xl: 34,
};

const TONE_BG: Record<AvatarTone, string> = {
  primary: COLORS.primary,
  neutral: '#64748b',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
};

export function Avatar({
  initials,
  imageUrl,
  imageSource,
  size = 'md',
  tone = 'primary',
}: AvatarProps) {
  const dim = SIZE_PX[size];
  const hasImage = Boolean(imageUrl || imageSource);

  return (
    <View
      style={[
        styles.circle,
        { width: dim, height: dim, borderRadius: dim / 2 },
        !hasImage ? { backgroundColor: TONE_BG[tone] } : null,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : imageSource ? (
        <Image
          source={imageSource}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.initials, { fontSize: FONT_SIZE[size] }]}>
          {initials ?? '•'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
